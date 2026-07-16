---
description: Rules for Service Classes (Business Logic Layer)
applyTo: services/**/*.ts, repositories/**/*.ts
---

# Service Rules — Business Logic Layer

Services contain all domain logic. They are pure TypeScript classes — no React, no Next.js, no direct Prisma imports. Everything is injected. This makes them fully unit-testable.

---

## 1. Every Service Has an Interface

Define the public contract before writing the class. The interface is the API — the class is the implementation.

```typescript
// ✅ Interface-first design
export interface IListingService {
  createListing(dto: CreateListingDto): Promise<CarListing>;
  getListingById(id: number): Promise<CarListing | null>;
  calculateTruthScore(listingId: number): Promise<TruthScoreBreakdown>;
}

export class ListingService implements IListingService {
  constructor(private readonly db: PrismaClient) {}
  // ...
}
```

---

## 2. Dependency Injection — No Global Singletons Inside Services

Dependencies (database, external APIs, mailer) must be passed via the constructor. Never import the global `prisma` singleton inside a service class body.

```typescript
// ✅ Correct — injectable
export class ListingService {
  constructor(
    private readonly db: PrismaClient,
    private readonly mailer: IMailer,
  ) {}
}

// ❌ Wrong — hardcoded, untestable
export class ListingService {
  async getListing(id: number) {
    return prisma.carListing.findUnique({ where: { id } }); // ← global singleton
  }
}
```

In API routes, construct with the singleton: `new ListingService(prisma, mailer)`.
In tests, inject mocks: `new ListingService(mockPrisma, mockMailer)`.

---

## 3. Services Are Stateless

No mutable instance state after construction. All data flows in through method parameters, and out through return values or thrown errors.

```typescript
// ✅ Stateless
class UserRoleService {
  constructor(private readonly db: PrismaClient) {}
  async getRoleForUser(userId: string) { ... }
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
| `ListingService` | Listing CRUD, publish/archive lifecycle |
| `TruthScoreService` | Truth score / TCO calculations for a listing |
| `UserRoleService` | Role assignment, permission checks (buyer/seller/dealer/admin) |
| `DealerService` | Dealer inventory, leads, reporting |
| `NotificationService` | Email dispatch (nodemailer) |
| `PaymentService` | Payment transaction lifecycle (Montonio/Everypay/Maksekeskus/Stripe) |

Do **not** put TCO calculation logic in `ListingService` or email logic in `UserRoleService`.

---

## 5. Throw Domain Errors, Not HTTP Errors

Services produce domain errors — never HTTP status codes or `NextResponse`. The API route layer translates errors to HTTP.

```typescript
// ✅ Domain error
if (!listing) throw new Error("Listing not found");
if (listing.status !== "draft") throw new Error("Listing cannot be published in current state");

// ❌ HTTP concern in service — wrong layer
if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
```

---

## 6. Validation Belongs in Services, Not API Routes

Input validation (business rules) lives in the service. Format/type validation (schema) can use zod in the API route.

```typescript
// ✅ Business rule validated in service
async createListing(dto: CreateListingDto) {
  if (dto.price <= 0) {
    throw new Error("Listing price must be positive");
  }
  if (dto.year < 1950 || dto.year > new Date().getFullYear() + 1) {
    throw new Error("Invalid model year");
  }
  return this.db.carListing.create({ data: dto });
}
```

---

## 7. Repository Pattern for Complex Data Access

For complex queries or when the data source may change, extract database access to a repository class. The service depends on the repository interface.

```typescript
export interface IListingRepository {
  findById(id: number): Promise<CarListing | null>;
  findBySeller(sellerId: string): Promise<CarListing[]>;
  save(data: CreateListingInput): Promise<CarListing>;
}

export class PrismaListingRepository implements IListingRepository {
  constructor(private readonly db: PrismaClient) {}
  findById(id: number) { return this.db.carListing.findUnique({ where: { id } }); }
  // ...
}

export class ListingService {
  constructor(private readonly repo: IListingRepository) {}
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