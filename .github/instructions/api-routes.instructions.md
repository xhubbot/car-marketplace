---
description: Rules for Next.js API Route Handlers (Thin Controllers)
applyTo: app/api/**/*.ts
---

# API Route Rules — Thin Controllers

API routes are controllers, not services. They must be thin: parse input → authorize → call service → return response. All business logic belongs in service classes.

---

## 1. The Thin Controller Pattern

An API route handler has exactly 4 responsibilities:

1. **Parse & validate** input (headers, body, query params)
2. **Authorize** the request (session check, role check)
3. **Call a service** with the validated input
4. **Return an HTTP response**

Nothing else. No Prisma queries inline. No business logic. No conditional chains beyond auth.

```typescript
// ✅ Correct — thin controller
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ListingService } from "@/services/ListingService";

export async function POST(request: NextRequest) {
  // 1. Authorize
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Parse & validate
  const body = await request.json();
  if (!body.make || !body.price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // 3. Call service
  const service = new ListingService(prisma);
  const listing = await service.createListing({ sellerId: session.user.id, ...body });

  // 4. Return response
  return NextResponse.json(listing, { status: 201 });
}
```

---

## 2. Authentication — NextAuth Session

All authenticated routes must check the NextAuth session via `getServerSession`:

```typescript
import { getServerSession } from "next-auth";

const session = await getServerSession();
if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

---

## 3. Role Authorization

Use a dedicated role/permission service — never inline role checks against `prisma.user` in the route:

```typescript
// ✅ Delegate to service
const roleService = new UserRoleService(prisma);
const isDealer = await roleService.isDealer(session.user.id);
if (!isDealer) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

// ❌ Inline role query
const user = await prisma.user.findFirst({ where: { id: session.user.id } });
if (user?.role !== "dealer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
```

Routes under `app/[locale]/admin/**` and `app/[locale]/dealer/**` are role-gated sections (admin/dealer).

---

## 4. Error Handling

Wrap the service call in try/catch. Map domain errors to HTTP status codes at this layer:

```typescript
try {
  const result = await service.publishListing(id);
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
  console.error("[LISTING_PUBLISH]", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
```

---

## 5. Input Validation — Use Zod for Schemas

Use Zod for parsing and validating request bodies. Keep schemas in `lib/schemas/` or co-located with the route:

```typescript
import { z } from "zod";

const CreateListingSchema = z.object({
  makeId: z.number().int().positive(),
  modelId: z.number().int().positive(),
  price: z.number().positive(),
  year: z.number().int().min(1950),
});

const parsed = CreateListingSchema.safeParse(await request.json());
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
}
```

---

## 6. No Direct Prisma in Route Handlers

Route handlers never call `prisma` directly — they instantiate a service, inject `prisma`, and call the service.

```typescript
// ❌ Direct Prisma in route
const listings = await prisma.carListing.findMany({ where: { sellerId } });

// ✅ Via service
const service = new ListingService(prisma);
const listings = await service.getListingsForSeller(sellerId);
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
app/api/
  cars/
    route.ts              ← GET (list), POST (create)
    [id]/
      route.ts            ← GET (single), PATCH (update), DELETE
      publish/
        route.ts          ← POST (action)
  auth/
    [...nextauth]/
      route.ts
  admin/
    listings/
      route.ts
```

One file per resource endpoint level. Actions that don't map to REST nouns get their own sub-path (`/resolve`, `/cancel`, `/approve`).