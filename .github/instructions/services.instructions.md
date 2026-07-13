---
description: Rules for Service Classes (Business Logic Layer)
applyTo: src/services/**/*.ts, src/repositories/**/*.ts
---

# Service Rules — Business Logic Layer

Services contain all domain logic. They are pure TypeScript classes — no React, no Next.js, no direct Prisma imports. Everything is injected. This makes them fully unit-testable.

---

## 1. Every Service Has an Interface

Define the public contract before writing the class. The interface is the API — the class is the implementation.

```typescript
// ✅ Interface-first design
export interface IEscrowService {
  createEscrow(dto: CreateEscrowDto): Promise<Escrow>;
  getEscrowById(id: string): Promise<Escrow | null>;
  resolveDispute(escrowId: string, resolution: DisputeResolution): Promise<void>;
}

export class EscrowService implements IEscrowService {
  constructor(private readonly db: PrismaClient) {}
  // ...
}
```

---

## 2. Dependency Injection — No Global Singletons Inside Services

Dependencies (database, external APIs, mailer) must be passed via the constructor. Never import the global `prisma` singleton inside a service class body.

```typescript
// ✅ Correct — injectable
export class EscrowService {
  constructor(
    private readonly db: PrismaClient,
    private readonly mailer: IMailer,
  ) {}
}

// ❌ Wrong — hardcoded, untestable
export class EscrowService {
  async getEscrow(id: string) {
    return prisma.escrow.findUnique({ where: { id } }); // ← global singleton
  }
}
```

In API routes, construct with the singleton: `new EscrowService(prisma, mailer)`.
In tests, inject mocks: `new EscrowService(mockPrisma, mockMailer)`.

---

## 3. Services Are Stateless

No mutable instance state after construction. All data flows in through method parameters, and out through return values or thrown errors.

```typescript
// ✅ Stateless
class UserRoleService {
  constructor(private readonly db: PrismaClient) {}
  async getRoleForWallet(wallet: string) { ... }
}

// ❌ Stateful — unpredictable in tests and concurrent requests
class UserRoleService {
  private cachedRole?: string;  // mutable state — wrong
  ...
}
```

---

## 4. Single Responsibility

One service owns one domain. Split when a service grows beyond its domain:

| Service | Responsibility |
|---------|----------------|
| `EscrowService` | Escrow CRUD, state transitions |
| `DisputeService` | Dispute creation, resolution, evidence |
| `UserRoleService` | Role assignment, permission checks |
| `PartnerService` | Partner registration, API key management |
| `NotificationService` | Email dispatch, webhook delivery |
| `GeminiService` | AI contract generation, chatbot |

Do **not** put dispute logic in `EscrowService` or email logic in `UserRoleService`.

---

## 5. Throw Domain Errors, Not HTTP Errors

Services produce domain errors — never HTTP status codes or `NextResponse`. The API route layer translates errors to HTTP.

```typescript
// ✅ Domain error
if (!escrow) throw new Error("Escrow not found");
if (escrow.status !== "PENDING") throw new Error("Escrow cannot be cancelled in current state");

// ❌ HTTP concern in service — wrong layer
if (!escrow) return NextResponse.json({ error: "Not found" }, { status: 404 });
```

---

## 6. Validation Belongs in Services, Not API Routes

Input validation (business rules) lives in the service. Format/type validation (schema) can use zod in the API route.

```typescript
// ✅ Business rule validated in service
async createEscrow(dto: CreateEscrowDto) {
  if (dto.buyerWallet === dto.sellerWallet) {
    throw new Error("Buyer and seller cannot be the same wallet");
  }
  if (dto.amount <= 0) {
    throw new Error("Escrow amount must be positive");
  }
  return this.db.escrow.create({ data: dto });
}
```

---

## 7. Repository Pattern for Complex Data Access

For complex queries or when the data source may change, extract database access to a repository class. The service depends on the repository interface.

```typescript
export interface IEscrowRepository {
  findById(id: string): Promise<Escrow | null>;
  findByWallet(wallet: string): Promise<Escrow[]>;
  save(data: CreateEscrowInput): Promise<Escrow>;
}

export class PrismaEscrowRepository implements IEscrowRepository {
  constructor(private readonly db: PrismaClient) {}
  findById(id: string) { return this.db.escrow.findUnique({ where: { id } }); }
  // ...
}

export class EscrowService {
  constructor(private readonly repo: IEscrowRepository) {}
}
```

---

## 8. Testability Checklist

Before a service is considered done, verify:

- [ ] All dependencies injected via constructor
- [ ] Interface defined and class implements it
- [ ] No React or Next.js imports
- [ ] No global singletons (`prisma`, `fetch`, `nodemailer`) used directly
- [ ] Unit tests exist for every public method
- [ ] Errors thrown as domain errors (not HTTP responses)