---
description: Rules for Next.js API Route Handlers (Thin Controllers)
applyTo: src/app/api/**/*.ts
---

# API Route Rules — Thin Controllers

API routes are controllers, not services. They must be thin: parse input → authorize → call service → return response. All business logic belongs in service classes.

---

## 1. The Thin Controller Pattern

An API route handler has exactly 4 responsibilities:

1. **Parse & validate** input (headers, body, query params)
2. **Authorize** the request (wallet header, role check)
3. **Call a service** with the validated input
4. **Return an HTTP response**

Nothing else. No Prisma queries inline. No business logic. No conditional chains beyond auth.

```typescript
// ✅ Correct — thin controller
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EscrowService } from "@/services/EscrowService";

export async function POST(request: NextRequest) {
  // 1. Authorize
  const wallet = request.headers.get("x-wallet-address")?.toLowerCase();
  if (!wallet) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Parse & validate
  const body = await request.json();
  if (!body.sellerWallet || !body.amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // 3. Call service
  const service = new EscrowService(prisma);
  const escrow = await service.createEscrow({ buyerWallet: wallet, ...body });

  // 4. Return response
  return NextResponse.json(escrow, { status: 201 });
}
```

---

## 2. Authentication — Wallet Header

All authenticated routes must check the `x-wallet-address` header. Always `.toLowerCase()` before use:

```typescript
const wallet = request.headers.get("x-wallet-address")?.toLowerCase();
if (!wallet) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

For partner/e-commerce routes, check the `X-API-Key` header against `partner_api_keys` table via `PartnerService`.

---

## 3. Role Authorization

Use `UserRoleService` — never inline role queries:

```typescript
// ✅ Delegate to service
const roleService = new UserRoleService(prisma);
const isAdmin = await roleService.isAdmin(wallet);
if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

// ❌ Inline role query
const user = await prisma.user.findFirst({ where: { wallet_address: wallet } });
if (user?.user_type !== 1) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
```

---

## 4. Error Handling

Wrap the service call in try/catch. Map domain errors to HTTP status codes at this layer:

```typescript
try {
  const result = await service.resolveDispute(id, resolution);
  return NextResponse.json(result);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message.includes("cannot")) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
  }
  console.error("[DISPUTE_RESOLVE]", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
```

---

## 5. Input Validation — Use Zod for Schemas

Use Zod for parsing and validating request bodies. Keep schemas in `src/schemas/` or co-located with the route:

```typescript
import { z } from "zod";

const CreateEscrowSchema = z.object({
  sellerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amount: z.number().positive(),
  token: z.enum(["USDC", "EURC"]),
});

const parsed = CreateEscrowSchema.safeParse(await request.json());
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
}
```

---

## 6. No Direct Prisma in Route Handlers

Route handlers never call `prisma` directly — they instantiate a service, inject `prisma`, and call the service.

```typescript
// ❌ Direct Prisma in route
const escrows = await prisma.escrow.findMany({ where: { buyer: wallet } });

// ✅ Via service
const service = new EscrowService(prisma);
const escrows = await service.getEscrowsForBuyer(wallet);
```

---

## 7. HTTP Method Semantics

| Method | Use case | Success status |
|--------|----------|----------------|
| `GET` | Read data | `200 OK` |
| `POST` | Create resource | `201 Created` |
| `PUT` / `PATCH` | Update resource | `200 OK` |
| `DELETE` | Delete resource | `200 OK` or `204 No Content` |

---

## 8. File Structure Convention

```
src/app/api/
  escrow/
    route.ts              ← GET (list), POST (create)
    [id]/
      route.ts            ← GET (single), PATCH (update), DELETE
      resolve/
        route.ts          ← POST (action)
  disputes/
    route.ts
    [id]/
      route.ts
  admin/
    manage-role/
      route.ts
```

One file per resource endpoint level. Actions that don't map to REST nouns get their own sub-path (`/resolve`, `/cancel`, `/approve`).