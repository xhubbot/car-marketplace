
# autod.pro AI Coding Agent Instructions

## Project Overview

autod.pro is an **ownership-first car classifieds/marketplace** platform — a single Next.js 16 (App Router) application (no monorepo, no Turborepo) with:

- **App**: Next.js 16 (App Router) + Prisma (MariaDB adapter) — everything lives at the repository root (`app/`, `components/`, `lib/`, `i18n/`, `messages/`, `prisma/`)
- **Auth**: NextAuth (credentials provider) — see [app/api/auth/[...nextauth]/route.ts](app/api/auth/%5B...nextauth%5D/route.ts)
- **Generated Prisma client**: `src/generated/prisma/` (do not edit — regenerated via `npx prisma generate`)

Core functionality: Browse and list car classifieds with an "ownership-first" philosophy — surfacing true total cost of ownership (TCO), a "truth score", and lifestyle-based recommendations (commute/adventure/speed/pragmatic) — alongside standard buyer/seller/dealer/admin listing workflows, multi-language support (en/et/ru), and a comparison deck for evaluating multiple listings side by side.

---

## Architecture Principles (MANDATORY)

All code in this project **must** follow these principles. They are non-negotiable.

### Layered Architecture — Strict Separation of Concerns

Every feature flows through clearly defined layers. **Never skip layers.**

```
Page / Component  (UI only — no business logic, no direct fetch calls)
       ↓
  Custom Hook     (orchestration — binds service calls to React state)
       ↓
   Service Class  (pure business logic — framework-agnostic, testable)
       ↓
  Repository      (data access — Prisma queries, injectable)
       ↓
  External Layer  (Database / External API)
```

**Layer responsibilities:**
- **Page/Component**: Renders UI. Calls hooks. Zero business logic.
- **Hook** (`hooks/`): Bridges service/query logic with React. Uses `useQuery`, `useMutation`, etc. Returns stable typed API.
- **Service** (`services/`): Pure TypeScript class. Handles business rules (e.g. TCO/truth-score calculations, listing lifecycle). No React. Fully unit-testable.
- **Repository** (`repositories/` or injected into service): Abstracts data access. Accepts injected Prisma client for testability.
- **API Route** (`app/api/`): Thin controller. Validate input → call service → return response. No business logic inline.

> Note: this project uses the root-level `@/*` path alias (mapped to the repository root in [tsconfig.json](tsconfig.json)), not `src/*`. New `hooks/`, `services/`, and `repositories/` folders should be created at the repository root alongside `lib/`, `components/`, and `app/`.

### SOLID Principles

- **S — Single Responsibility**: One class/hook/component does one thing. A component that fetches data AND renders a table AND validates a form violates SRP — split it.
- **O — Open/Closed**: Extend via new classes or hooks, not by editing existing ones. Use composition over conditional branching.
- **L — Liskov Substitution**: Services must be swappable through interfaces/abstractions. Always type services with an interface: `interface IListingService { ... }`.
- **I — Interface Segregation**: Keep interfaces small. A hook returning >5 values must be split.
- **D — Dependency Inversion**: Services receive dependencies (e.g., Prisma client, fetch function) via constructor injection, never using global singletons internally.

### Dependency Injection for Testability

Services and repositories **must** accept dependencies via constructor injection:

```typescript
// ✅ Correct — injectable, testable
class ListingService {
  constructor(private readonly db: PrismaClient) {}
  async getListing(id: number) { return this.db.carListing.findUnique({ where: { id } }); }
}

// ❌ Wrong — hardcoded dependency, untestable
class ListingService {
  async getListing(id: number) { return prisma.carListing.findUnique({ where: { id } }); }
}
```

In API routes, instantiate using the shared singleton: `new ListingService(prisma)`.
In tests, inject a mock: `new ListingService(mockPrisma)`.

### OOP Patterns for Services

- Use **classes** for services with multiple related methods.
- Use **interfaces** to define the public contract of every service.
- Use **static factory methods** for complex construction logic.
- Keep services **stateless** — no mutable instance properties after construction.

```typescript
interface IListingService {
  createListing(dto: CreateListingDto): Promise<CarListing>;
  getListingById(id: number): Promise<CarListing | null>;
  calculateTruthScore(listingId: number): Promise<TruthScoreBreakdown>;
}

class ListingService implements IListingService {
  constructor(private readonly db: PrismaClient) {}
  // ... implementations
}
```

---

## Project Structure & Scripts

- **Root commands**: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`
- Single Next.js app at the repository root — there is no `apps/web`, no Turborepo, no monorepo packages
- Prisma client is generated to `src/generated/prisma/` (via `npx prisma generate`) and imported as `@/generated/prisma/client`
- **Windows development**: Use PowerShell for npm scripts

---

## Critical Patterns

### Provider Hierarchy

Client-side providers are composed in [app/[locale]/_components/AppShell.tsx](app/%5Blocale%5D/_components/AppShell.tsx), wrapped around the page content rendered from [app/[locale]/layout.tsx](app/%5Blocale%5D/layout.tsx):

```tsx
<NextIntlClientProvider> → <SessionProvider> → <ThemeProvider> → <CompareProvider>
```

- `SessionProvider` — NextAuth session context
- `ThemeProvider` ([app/[locale]/_context/ThemeContext.tsx](app/%5Blocale%5D/_context/ThemeContext.tsx)) — dark mode toggle
- `CompareProvider` ([app/[locale]/_context/CompareContext.tsx](app/%5Blocale%5D/_context/CompareContext.tsx)) — comparison deck state (selected listings, monthly mileage, deck visibility)

### API Route Structure (Thin Controller Pattern)

API routes delegate all logic to a service. The route only handles: parse input → authorize → call service → return response.

```typescript
// ✅ Correct — thin controller
import prisma from "@/lib/prisma";
import { ListingService } from "@/services/ListingService";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const service = new ListingService(prisma);
  const result = await service.createListing(body);
  return NextResponse.json(result, { status: 201 });
}

// ❌ Wrong — business logic in route handler
export async function POST(request: NextRequest) {
  const body = await request.json();
  const existing = await prisma.carListing.findFirst({ where: { ... } });
  if (existing) { /* inline validation logic */ }
  // 50 more lines of inline logic...
}
```

- **Authentication**: NextAuth session/credentials — see [app/api/auth/[...nextauth]/route.ts](app/api/auth/%5B...nextauth%5D/route.ts)
- **Role checks**: Buyer/seller/dealer/admin — routes under `app/[locale]/admin/**` and `app/[locale]/dealer/**` are role-gated sections

---

## Domain Reference

### Database & Prisma

- **Schema**: [prisma/schema.prisma](prisma/schema.prisma) (MySQL/MariaDB, accessed via `@prisma/adapter-mariadb`)
- **Singleton**: Always import from `@/lib/prisma` (default export) — inject into services, never import inside service class body
- **Key models**: `CarListing`, `CarListingTranslation`, `CarMake`, `CarModel`, `ModelPeriod`, `CarImage`, `CarFeature`, `CarListingFeature`, `PremiumFeature`, `CarListingPremiumFeature`, `FuelType`, `Transmission`, `DriveType`, `BodyType`, `Color`, `EmissionStandard`, `Location`, `Country`, `Translation` (generic per-locale name lookup), `PaymentTransaction`
- **Key enums**: `ListingStatus` (draft/active/sold/expired), `ColorFinish`, `OrderStatus`, `PaymentGateway`, `PaymentStatus`
- **After schema changes**: `npx prisma generate` (regenerates `src/generated/prisma/`)
- **Migrations**: `npx prisma migrate dev --name <name>` (see [prisma/migrations/](prisma/migrations/))
- **Seeding**: `tsx prisma/seed.ts` (configured as the `prisma.seed` script in [package.json](package.json))

### Ownership-First Domain Logic

- **TCO / truth score calculations**: [lib/tco.ts](lib/tco.ts) — loan payment, energy cost, monthly TCO, class-average TCO comparisons
- **Shared domain types**: [lib/types.ts](lib/types.ts) — `CarListing`, `CarSpecs`, `CarExpenses`, `SellerInfo`, `ViewMode` (`"standard" | "ownership"`)
- **Lifestyle categories**: `commute`, `adventure`, `speed`, `pragmatic` — drive listing recommendations and filtering ([app/[locale]/_components/LifestyleFilter.tsx](app/%5Blocale%5D/_components/LifestyleFilter.tsx))
- **Comparison deck**: [app/[locale]/_context/CompareContext.tsx](app/%5Blocale%5D/_context/CompareContext.tsx) + [app/[locale]/_components/ComparisonDeck.tsx](app/%5Blocale%5D/_components/ComparisonDeck.tsx) — lets users stage multiple listings for side-by-side comparison

### Internationalization (next-intl)

- **Locales**: `en`, `et`, `ru` ([i18n.config.ts](i18n.config.ts), [i18n/routing.ts](i18n/routing.ts))
- **Routes**: All pages live under `app/[locale]/`
- **Usage**: `const t = useTranslations("namespace")` (client) or `getTranslations` (server) — always use namespaces
- **Files**: [messages/en.json](messages/en.json), [messages/et.json](messages/et.json), [messages/ru.json](messages/ru.json) — **keep all 3 in sync** on every key change
- **SEO**: Use `generateMetadata` with `getTranslations` (server-side) for translated meta tags

---

## Development Workflows

### Starting Development

1. Ensure MariaDB/MySQL is running and `DATABASE_URL` is set in `.env.local` (parsed via `new URL(...)` in [lib/prisma.ts](lib/prisma.ts))
2. From root: `npm install` (generates Prisma client automatically via postinstall)
3. Start the app: `npm run dev` (opens on `http://localhost:3000`)

### Adding New Features — Checklist

1. **Service first**: Write the service class with interface in `services/` (create the folder at repo root if it doesn't exist yet)
2. **Repository**: If data access is complex, extract to `repositories/`
3. **Test**: Write unit tests for the service before wiring the UI
4. **API route**: Create thin controller in `app/api/feature/route.ts`
5. **Hook**: Create `hooks/useFeature.ts` wrapping the API call
6. **Page**: Create `app/[locale]/feature/page.tsx` (Server Component by default)
7. **Component**: Extract UI to `components/FeatureName.tsx` or `app/[locale]/**/_components/FeatureName.tsx` (`"use client"` only if needed)
8. **Translations**: Update all 3 JSON files in `messages/`
9. **Schema**: If DB changed → `npx prisma migrate dev` → `npx prisma generate`

### Debugging Common Issues

- **"Prisma Client not generated"**: `npx prisma generate` from the repo root
- **Translation missing**: Verify key exists in all 3 locale files (`messages/en.json`, `messages/et.json`, `messages/ru.json`)
- **DB connection errors**: Verify `DATABASE_URL` is a valid URL string (`lib/prisma.ts` parses host/port/user/password/database from it)

---

## Testing

- No Jest configuration exists in this project yet. If you add tests, follow the layered pattern: unit-test service classes with an injected mock Prisma client, and keep tests colocated with the layer they exercise.
- **Coverage target**: All service classes should have unit tests once introduced. Hooks with side effects should be tested with `@testing-library/react` `renderHook`.

**What must be tested (once test tooling is added):**
- All service class methods (pure business logic, e.g. TCO/truth-score calculations)
- All utility functions in `lib/`
- API route handlers (mock `NextRequest`)
- Hooks with side effects

**Mocking strategy:**
- Mock Prisma with `jest.mock('@/lib/prisma')` or use the injected client pattern
- Mock `fetch` with `jest.spyOn(global, 'fetch')`

See `.github/instructions/testing.instructions.md` for full patterns.

---

## Key File References

- **Prisma singleton**: [lib/prisma.ts](lib/prisma.ts)
- **TCO/truth-score logic**: [lib/tco.ts](lib/tco.ts)
- **Domain types**: [lib/types.ts](lib/types.ts)
- **Auth route**: [app/api/auth/[...nextauth]/route.ts](app/api/auth/%5B...nextauth%5D/route.ts)
- **App shell / providers**: [app/[locale]/_components/AppShell.tsx](app/%5Blocale%5D/_components/AppShell.tsx)
- **Compare context**: [app/[locale]/_context/CompareContext.tsx](app/%5Blocale%5D/_context/CompareContext.tsx)
- **i18n config**: [i18n.config.ts](i18n.config.ts), [i18n/routing.ts](i18n/routing.ts)

---

## Conventions

1. **Imports**: Use the `@/` alias for absolute imports — it maps to the repository root (see [tsconfig.json](tsconfig.json)), e.g. `@/lib/prisma`, `@/generated/prisma/client`
2. **Client components**: Only add `"use client"` when you actually need browser APIs, event handlers, or React state. Prefer Server Components.
3. **Styling**: TailwindCSS v4 + custom classes in `app/[locale]/globals.css`
4. **Timestamps**: Use `DateTime` fields as returned by Prisma; convert as needed in the UI
5. **File uploads**: Store under `public/images/` or `public/uploads/<context>/<filename>` as applicable
6. **Environment vars**: `NEXT_PUBLIC_*` for client-side, plain for server-side only (e.g. `DATABASE_URL`)
7. **Package versions**: React 19, Next.js 16, TypeScript 5 — check compatibility before adding deps
8. **Windows development**: Use PowerShell for npm scripts
9. **Modals**: Use Radix UI primitives (`radix-ui` dependency) for dialogs/modals

---

## Instruction Files (Domain-Specific Rules)

More detailed rules for specific layers are maintained in `.github/instructions/`:

| File | Applies To | Topic |
|------|-----------|-------|
| `hooks.instructions.md` | `hooks/**`, `features/**/hooks/*` | Hook encapsulation, OOP, testing |
| `services.instructions.md` | `services/**`, `repositories/**` | Service classes, SOLID, DI |
| `pages.instructions.md` | `app/[locale]/**` | Page components, Server/Client boundary |
| `api-routes.instructions.md` | `app/api/**` | Thin controllers, validation, auth |
| `components.instructions.md` | `components/**`, `app/[locale]/**/_components/**` | UI components, props, accessibility |
| `seo.instructions.md` | `app/**` | Metadata, structured data, i18n SEO |
| `testing.instructions.md` | `__tests__/**` | Jest patterns, mocking, coverage |
