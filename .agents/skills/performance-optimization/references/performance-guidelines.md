# Performance Guidelines

Use this guide to make optimization decisions with clear tradeoffs.

## Code Splitting

Code splitting breaks production JavaScript into smaller chunks so the app loads in parts instead of all at once.

Recommended approach:

- Prefer route-level splitting so only essential code is loaded at startup.
- Lazy-load non-critical routes and screens.
- Avoid over-splitting into many tiny chunks, which can increase request overhead.
- Balance startup speed and total request count.

Reference pattern in this repository:

- `src/app/router.tsx` uses `lazy(() => import(...))` for route components.

## Component and State Optimizations

- Do not put unrelated concerns in one large state object; split state by usage boundary.
- Keep state as close as possible to where it is consumed to reduce unnecessary rerenders.
- For expensive state initialization, use lazy initializers:

```tsx
// Avoid running expensive initialization on every render.
const [state, setState] = React.useState(() => myExpensiveFn());
```

- For high-frequency shared updates, use selector-based state access.
- Use Context for low-velocity concerns (theme, auth identity, static-ish settings).
- For medium/high-velocity updates, prefer selector-capable approaches (for example Zustand selectors, context selectors, or atomic stores).
- Before introducing global state, evaluate lifting state and component composition first.
- For performance-sensitive surfaces, prefer lower-runtime styling cost solutions (for example CSS Modules or build-time CSS extraction).

## Children as a Baseline Optimization

Composition through `children` can isolate stable subtrees from parent rerenders.

```tsx
// Less optimal: PureComponent rerenders whenever count changes.
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
      <PureComponent />
    </div>
  );
};

// More optimal: children subtree is stable from Counter updates.
const App = () => (
  <Counter>
    <PureComponent />
  </Counter>
);

const Counter = ({ children }: { children: React.ReactNode }) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
      {children}
    </div>
  );
};
```

## Image Optimizations

- Lazy-load images outside the initial viewport.
- Prefer modern formats like WebP where quality constraints allow.
- Use `srcset` and responsive sizes to serve right-sized images per device.

## Web Vitals

- Track Lighthouse and PageSpeed Insights when touching loading/rendering paths.
- Treat major Core Web Vitals regressions as release blockers for user-critical routes.

## Data Prefetching

Use TanStack Query prefetching when navigation intent is predictable.

```ts
await queryClient.prefetchQuery({
  queryKey: ["shipments", "list", filters],
  queryFn: () => fetchShipments(filters),
});
```

Use prefetching selectively:

- High-confidence transitions (hover, visible next step, strong CTA sequence).
- Avoid aggressive prefetching that increases background traffic without user value.
