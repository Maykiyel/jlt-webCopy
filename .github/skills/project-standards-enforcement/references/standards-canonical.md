# JLT Web Architecture and Agent Standards

This repository uses a feature-first architecture designed for scalability, clear ownership, and safe refactoring.

## Project Structure

Most code lives under src and follows this high-level model:

```sh
src
|
+-- app               # application composition layer (routes/router/providers)
|   +-- routes
|   +-- app.tsx
|   +-- provider.tsx
|   +-- router.tsx
+-- assets            # global static assets
+-- components        # shared UI primitives and reusable cross-feature components
+-- config            # app-level configuration and env mapping
+-- features          # feature modules (primary location for business/domain code)
+-- hooks             # shared hooks
+-- lib               # reusable library integrations and helpers
+-- stores            # global stores
+-- testing           # test utilities and mocks
+-- types             # shared types
+-- utils             # shared utilities
```

## Core Principles

1. Keep domain logic inside src/features.
2. Keep shared infrastructure in shared folders (components, hooks, lib, types, utils).
3. Compose multiple features only at src/app.
4. Prefer direct imports over barrel files.
5. Keep refactors behavior-preserving unless UI/behavior change is explicitly requested.

## Feature Module Shape

Each feature should contain only what it needs. Typical shape:

```sh
src/features/<feature-name>
|
+-- services
+-- assets
+-- components
+-- hooks
+-- stores
+-- types
+-- utils
```

Notes:

1. Not every folder is required in every feature.
2. Add folders only when there is real usage.
3. Keep file names and responsibilities explicit.

## Dependency Direction and Import Rules

Use strict unidirectional flow:

- Shared -> Features -> App

Allowed:

1. src/features/\* importing from shared modules.
2. src/app/\* importing from shared modules and features.

Disallowed:

1. Shared modules importing from src/features or src/app.
2. Feature-to-feature imports unless there is a strong, approved reason.

If reuse is needed across features, move that logic to a shared module instead of importing another feature directly.

## API Placement Guidance

Default:

1. Keep feature-specific API functions/hooks in src/features/<feature>/services.

Exception:

1. If API contracts are heavily shared across many features, a dedicated global API module can be used (for example under src/lib/api).

## Refactor Standards for Monolithic Files

When breaking down large files:

1. Extract pure business/data derivation logic into feature utils.
2. Extract reusable UI fragments into feature components.
3. Keep page/container files focused on orchestration, routing, and state wiring.
4. Keep type definitions near the feature; only promote truly shared types.
5. Keep patches small and safe; avoid unrelated format churn.
6. Validate touched files for type and lint errors after edits.

## Quotations Feature Rules

Apply these rules consistently in src/features/quotations:

1. Compose flow should stay modular.
2. Billing derivations (empty checks, filtering, totals) must come from one utility source.
3. Preview and PDF outputs must use the same derived billing logic.
4. Empty charge rows are non-renderable for output documents.
5. Empty billing sections should not render output tables.
6. At least one meaningful charge is required before continuing from billing.

## Editing and Safety Preferences

1. Prefer concise, targeted patches.
2. Avoid broad rewrites when extraction can solve the issue.
3. Add comments only where logic is genuinely non-obvious.
4. Preserve existing UX and data contracts unless change is explicitly requested.
5. Verify changed files with lint/type checks.

## ESLint Enforcement Guidance

Use lint rules to enforce architecture constraints:

1. Add import/no-restricted-paths zones to block cross-feature imports.
2. Add zones to enforce unidirectional flow between shared, features, and app.
3. Start strict for new code; phase in incrementally for existing modules if needed.

## Agent Execution Expectations

When implementing changes in this repository:

1. Prioritize feature-scoped modularization over adding complexity in page files.
2. Reuse existing utilities before creating new duplicated logic.
3. Keep preview/PDF logic aligned and deterministic.
4. If unsure where code belongs, prefer feature-level placement first.

## Performance Standards

### Code Splitting

1. Prefer route-level code splitting so only essential code loads initially.
2. Lazy-load non-critical screens/components using dynamic imports.
3. Avoid over-splitting into tiny chunks that increase request overhead.
4. Balance startup performance and network request count.

### Component and State Optimization

1. Avoid putting unrelated concerns into one large state object.
2. Keep state close to where it is used to reduce unnecessary rerenders.
3. Use lazy state initializers for expensive computations:

```ts
// avoid running on every render
const [state, setState] = React.useState(expensiveInit());

// preferred: run only on first render
const [state, setState] = React.useState(() => expensiveInit());
```

1. For high-frequency updates, prefer selector-based stores/patterns.
2. Use Context for low-velocity/shared concerns (theme, auth identity, static settings).
3. For medium/high-velocity updates, prefer selector-based state tools (for example Zustand selectors).
4. Before introducing global state, consider lifting state and component composition first.
5. Prefer low-runtime styling strategies where feasible; avoid runtime-heavy styling solutions for performance-critical paths.

### Children as a Baseline Optimization

1. Prefer children composition to isolate unaffected subtrees from rerenders.
2. When parent state updates frequently, keep stable UI fragments as children when possible.

### Image Optimization

1. Lazy-load images outside the initial viewport.
2. Prefer modern formats (for example WebP) when asset quality permits.
3. Use responsive image strategies (srcset/sized variants) for device-appropriate loading.

### Web Vitals and Measurement

1. Monitor Lighthouse and PageSpeed scores regularly.
2. Track Core Web Vitals regressions when touching route loading, rendering, or large assets.
3. Treat major regressions as blockers for performance-sensitive flows.

### Data Prefetching

1. Use queryClient.prefetchQuery (TanStack Query) when navigation intent is predictable.
2. Prefetch likely-next page data to reduce user-perceived loading time.
3. Scope prefetching to high-confidence transitions to avoid unnecessary network usage.

## State Management Standards

Use the following state model consistently in this codebase.

### Component State (React)

1. Use useState for simple local state.
2. Use useReducer for complex local transitions that update multiple values together.
3. Keep state as close as possible to usage; lift only when multiple siblings need it.
4. Prefer composition (children) before introducing shared/global state.

### Application State (Zustand)

1. Use Zustand for client-side app state that must be shared across features/routes.
2. Split stores by domain; avoid one giant global store.
3. Use selectors to reduce rerenders.
4. Keep actions in the store and keep components focused on rendering and orchestration.
5. Do not store server cache in Zustand when React Query is the source of truth.

### Server Cache State (React Query)

1. Use TanStack React Query for all server data fetching/caching.
2. Keep query keys stable and domain-based.
3. Co-locate query functions and query hooks under feature services/ when feature-specific.
4. Use staleTime, gcTime, and invalidation intentionally.
5. Mutations should invalidate or update relevant queries explicitly.
6. Use prefetching for high-confidence navigation paths.

### Form State (React Hook Form + Zod)

1. Use React Hook Form for form state and submission.
2. Use Zod schemas as the single source of truth for validation.
3. Always wire forms through zodResolver where schema validation is required.
4. Keep schema definitions in feature schemas/ and reuse them in form, preview, and submission paths.
5. Prefer reusable field wrappers from shared components/form for consistency.
6. Keep form-level derivations/transformations in feature utils instead of inline in components.

### URL State (React Router)

1. Use route params and query params for navigational/shareable state.
2. Keep ephemeral UI-only state out of URL unless deep-linking is needed.
3. Derive page data from URL state plus React Query whenever possible.
4. Treat URL as a source of truth for filters, tabs, and entity selection.

### Decision Rules

1. Local UI concern for a single component: React local state.
2. Shared client state not from server: Zustand.
3. Remote/server-backed data: React Query.
4. Form input/validation/submission: React Hook Form + Zod.
5. Navigation/shareable state: URL (React Router).
