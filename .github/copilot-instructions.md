
# RahaKaitse AI Coding Agent Instructions

## Project Overview

RahaKaitse is a blockchain-based escrow platform built as a **Turborepo monorepo** with:

- **Web**: Next.js 16 (App Router) + Prisma + Smart Contracts
- **Mobile**: React Native (Expo) - in development
- **Packages**: `@rahakaitse/shared` (business logic), `@rahakaitse/types` (TypeScript types)
- **E-commerce SDK**: Vanilla JavaScript SDK for third-party integration

Core functionality: Secure escrow transactions using smart contracts on Base blockchain (testnet: Base Sepolia), with role-based access (buyer/seller/arbiter/admin), dispute resolution, multi-language support (en/et/ru), and e-commerce partner integration via JavaScript SDK.

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
  Repository      (data access — Prisma queries or contract calls, injectable)
       ↓
  External Layer  (Database / Smart Contract / External API)
```

**Layer responsibilities:**
- **Page/Component**: Renders UI. Calls hooks. Zero business logic.
- **Hook** (`src/hooks/`): Bridges service/query logic with React. Uses `useQuery`, `useMutation`, Wagmi hooks. Returns stable typed API.
- **Service** (`src/services/`): Pure TypeScript class. Handles business rules. No React. Fully unit-testable.
- **Repository** (`src/repositories/` or injected into service): Abstracts data access. Accepts injected Prisma client for testability.
- **API Route** (`app/api/`): Thin controller. Validate input → call service → return response. No business logic inline.

### SOLID Principles

- **S — Single Responsibility**: One class/hook/component does one thing. A component that fetches data AND renders a table AND validates a form violates SRP — split it.
- **O — Open/Closed**: Extend via new classes or hooks, not by editing existing ones. Use composition over conditional branching.
- **L — Liskov Substitution**: Services must be swappable through interfaces/abstractions. Always type services with an interface: `interface IEscrowService { ... }`.
- **I — Interface Segregation**: Keep interfaces small. A hook returning >5 values must be split.
- **D — Dependency Inversion**: Services receive dependencies (e.g., Prisma client, fetch function) via constructor injection, never using global singletons internally.

### Dependency Injection for Testability

Services and repositories **must** accept dependencies via constructor injection:

```typescript
// ✅ Correct — injectable, testable
class EscrowService {
  constructor(private readonly db: PrismaClient) {}
  async getEscrow(id: string) { return this.db.escrow.findUnique({ where: { id } }); }
}

// ❌ Wrong — hardcoded dependency, untestable
class EscrowService {
  async getEscrow(id: string) { return prisma.escrow.findUnique({ where: { id } }); }
}
```

In API routes, instantiate using the shared singleton: `new EscrowService(prisma)`.
In tests, inject a mock: `new EscrowService(mockPrisma)`.

### OOP Patterns for Services

- Use **classes** for services with multiple related methods.
- Use **interfaces** to define the public contract of every service.
- Use **static factory methods** for complex construction logic.
- Keep services **stateless** — no mutable instance properties after construction.

```typescript
interface IEscrowService {
  createEscrow(dto: CreateEscrowDto): Promise<Escrow>;
  getEscrowById(id: string): Promise<Escrow | null>;
  resolveDispute(escrowId: string, resolution: DisputeResolution): Promise<void>;
}

class EscrowService implements IEscrowService {
  constructor(private readonly db: PrismaClient) {}
  // ... implementations
}
```

---

## Monorepo Structure & Scripts

- **Root commands**: `npm run dev:web`, `npm run dev:mobile`, `npm run build:web`
- Always work from project root unless editing configs
- Changes to `packages/*` require rebuild: `npm run build` (Turborepo handles caching)
- Prisma client auto-generates on `npm install` via postinstall script

---

## Critical Patterns

### Wagmi Authentication Flow (CRITICAL)

**Problem**: Wagmi rehydrates wallet connection from localStorage on page refresh, causing brief `isConnected: false` state.

**Pattern** ([useRequireAuth.ts](apps/web/src/hooks/useRequireAuth.ts)):

```typescript
const { isConnected, isConnecting, isReconnecting } = useAccount();
const [isStabilized, setIsStabilized] = useState(false);

// WAIT for wagmi to finish ALL connection attempts before redirecting
if (!isConnecting && !isReconnecting) {
  setIsStabilized(true);
  if (!isConnected) redirect("/"); // NOW it's safe
}
```

**Never redirect on `isConnected === false` alone** — always check `isConnecting` and `isReconnecting` first.

### Provider Hierarchy

All client components must be wrapped in this exact order ([apps/web/src/components/Providers.tsx](apps/web/src/components/Providers.tsx)):

```tsx
<WagmiProvider> → <QueryClientProvider> → <OnchainKitProvider>
  → <ToastProvider> → <AppContextProvider> → <UserRoleProvider> → <EscrowProvider>
```

### API Route Structure (Thin Controller Pattern)

API routes delegate all logic to a service. The route only handles: parse input → authorize → call service → return response.

```typescript
// ✅ Correct — thin controller
export async function POST(request: NextRequest) {
  const wallet = request.headers.get("x-wallet-address")?.toLowerCase();
  if (!wallet) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const service = new EscrowService(prisma);
  const result = await service.createEscrow({ wallet, ...body });
  return NextResponse.json(result, { status: 201 });
}

// ❌ Wrong — business logic in route handler
export async function POST(request: NextRequest) {
  const body = await request.json();
  const existing = await prisma.escrow.findFirst({ where: { ... } });
  if (existing) { /* inline validation logic */ }
  // 50 more lines of inline logic...
}
```

- **Authentication**: Header `x-wallet-address` (wallet address, always `.toLowerCase()`)
- **Role checks**: Via `UserRoleService` — `user_type` (1=admin, 2=arbiter, 3=user)

---

## Domain Reference

### Database & Prisma

- **Schema**: `apps/web/prisma/schema.prisma` (MySQL)
- **Singleton**: Always import from `@/lib/prisma` — inject into services, never import inside service class body
- **Key tables**: `escrow`, `dispute`, `user`, `partner`, `partner_contact`, `feedback`, `article`
- **After schema changes**: `npx prisma generate` (from `apps/web/`)
- **Migrations**: `npx prisma migrate dev --name <name>`

### Smart Contracts

- **Location**: `contracts/*.sol` (root level)
- `EscrowHub.sol` — Factory, creates individual escrows
- `EscrowDisputeManagement.sol` — Dispute logic
- `FeeCollectorManagement.sol` — Fee management
- **Network**: Base Sepolia (chainId: 84532) | Token: USDC/EURC (ERC-20, requires allowance)
- **Deployment**: `npm run deploy:base` | **TypeChain** auto-generates types in `typechain-types/`

### Internationalization (next-intl)

- **Locales**: `en`, `et`, `ru` ([i18n/routing.ts](apps/web/src/i18n/routing.ts))
- **Routes**: All pages under `/[locale]/` — middleware auto-redirects based on `Accept-Language`
- **Usage**: `const t = useTranslations("namespace")` — always use namespaces
- **Files**: `apps/web/src/messages/{en,et,ru}.json` — **keep all 3 in sync** on every key change
- **SEO**: Use `generateMetadata` with `getTranslations` (server-side) for translated meta tags

### E-commerce SDK

- `public/rahakaitse-sdk.js` — Framework-agnostic vanilla JS SDK, CDN hosted
- API key auth via `X-API-Key` header, keys stored in `partner_api_keys` table
- Partner endpoints: `POST /api/ecommerce/escrow/create`, `GET /api/ecommerce/escrow/[id]`

---

## Development Workflows

### Starting Development

1. Ensure MySQL running and `DATABASE_URL` set in `apps/web/.env.local`
2. From root: `npm install` (generates Prisma client automatically)
3. Start web: `npm run dev:web` (opens on `http://localhost:3000`)

### Adding New Features — Checklist

1. **Service first**: Write the service class with interface in `src/services/`
2. **Repository**: If data access is complex, extract to `src/repositories/`
3. **Test**: Write unit tests for the service before wiring the UI
4. **API route**: Create thin controller in `src/app/api/feature/route.ts`
5. **Hook**: Create `src/hooks/useFeature.ts` wrapping the API call with React Query
6. **Page**: Create `src/app/[locale]/feature/page.tsx` (Server Component by default)
7. **Component**: Extract UI to `src/components/FeatureName.tsx` (`"use client"` only if needed)
8. **Translations**: Update all 3 JSON files in `src/messages/`
9. **Schema**: If DB changed → `npx prisma migrate dev` → `npx prisma generate`

### Smart Contract Development

1. Edit `.sol` files in `contracts/`
2. Compile: `npm run compile` (generates artifacts + TypeChain types)
3. Test: `npm run test-hardhat`
4. Deploy: `npm run deploy:base`
5. Update `NEXT_PUBLIC_ESCROW_HUB_ADDRESS` in `.env.local`

### Debugging Common Issues

- **"Module not found @rahakaitse/..."**: `npm run build` from root
- **"Prisma Client not generated"**: `cd apps/web && npx prisma generate`
- **Wallet connection loops**: Check `useRequireAuth` — must use `isConnecting` + `isReconnecting`
- **Translation missing**: Verify key exists in all 3 locale files
- **Contract deployment fails**: Verify `BASE_SEPOLIA_RPC_URL`, `PRIVATE_KEY`, `BASESCAN_API_KEY`

---

## Testing

- **Runner**: Jest (`apps/web/jest.config.ts`) — `testEnvironment: "node"`, tests matched from `__tests__/**/*.test.ts`
- **Run**: `npm run test` (from `apps/web/`) or `npx jest --watch`
- **Hardhat tests**: `npm run test-hardhat` (smart contract tests in `test/`)
- **Coverage target**: All service classes must have unit tests. Hooks tested with `@testing-library/react` `renderHook`.

**What must be tested:**
- All service class methods (pure business logic)
- All utility functions in `src/utils/`
- API route handlers (use `next-test-api-route-handler` or mock `NextRequest`)
- Hooks with side effects (`useDeployEscrow`, `useRequireAuth`)

**Mocking strategy:**
- Mock Prisma with `jest.mock('@/lib/prisma')` or use the injected client pattern
- Mock Wagmi hooks with `jest.mock('wagmi')`
- Mock `fetch` with `jest.spyOn(global, 'fetch')`

See `.github/instructions/testing.instructions.md` for full patterns.

---

## Key File References

- **Wagmi config**: [apps/web/src/lib/wagmi.ts](apps/web/src/lib/wagmi.ts)
- **Auth hook**: [apps/web/src/hooks/useRequireAuth.ts](apps/web/src/hooks/useRequireAuth.ts)
- **Providers**: [apps/web/src/components/Providers.tsx](apps/web/src/components/Providers.tsx)
- **Role context**: [apps/web/src/context/UserRoleContext.tsx](apps/web/src/context/UserRoleContext.tsx)
- **Prisma singleton**: [apps/web/src/lib/prisma.ts](apps/web/src/lib/prisma.ts)
- **i18n routing**: [apps/web/src/i18n/routing.ts](apps/web/src/i18n/routing.ts)

---

## Conventions

1. **Imports**: Use `@/` alias for absolute imports in web app (maps to `apps/web/src/`)
2. **Client components**: Only add `"use client"` when you actually need browser APIs, event handlers, or React state. Prefer Server Components.
3. **Styling**: TailwindCSS v4 + custom classes in `apps/web/src/app/globals.css`
4. **Blockchain addresses**: Always `.toLowerCase()` before comparison
5. **Timestamps**: Unix timestamps (seconds) in database, convert to `Date` in frontend
6. **File uploads**: `apps/web/public/uploads/<walletAddress>/<filename>` or `uploads/disputes/<id>/<filename>`
7. **Environment vars**: `NEXT_PUBLIC_*` for client-side, plain for server-side only
8. **Package versions**: React 19, Next.js 16, TypeScript 5.8 — check compatibility before adding deps
9. **Windows development**: Use PowerShell for npm scripts
10. **Modals**: react-modal — always set `Modal.setAppElement()`

---

## Instruction Files (Domain-Specific Rules)

More detailed rules for specific layers are maintained in `.github/instructions/`:

| File | Applies To | Topic |
|------|-----------|-------|
| `hooks.instructions.md` | `src/hooks/**` | Hook encapsulation, OOP, testing |
| `services.instructions.md` | `src/services/**` | Service classes, SOLID, DI |
| `pages.instructions.md` | `src/app/[locale]/**` | Page components, Server/Client boundary |
| `api-routes.instructions.md` | `src/app/api/**` | Thin controllers, validation, auth |
| `components.instructions.md` | `src/components/**` | UI components, props, accessibility |
| `seo.instructions.md` | `src/app/**` | Metadata, structured data, i18n SEO |
| `testing.instructions.md` | `src/__tests__/**` | Jest patterns, mocking, coverage |
