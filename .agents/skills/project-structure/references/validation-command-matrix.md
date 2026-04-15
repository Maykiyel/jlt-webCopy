# Validation Command Matrix

Use this matrix to choose required validation gates based on structure-change scope.

## Baseline Command

1. Always run for code/config changes: pnpm lint

## Command Selection by Scope

1. Documentation-only skill/instructions changes: lint optional, no tests required.
2. ESLint rule updates (for example import/no-restricted-paths zones): pnpm lint required.
3. File moves/refactors that alter imports: pnpm lint and targeted tests required.
4. Shared-layer changes affecting multiple features: pnpm lint and pnpm test required.
5. App-layer routing/composition or broad architecture refactors: pnpm lint, pnpm test, and pnpm build required.

## Evidence Logging

1. Record each command executed.
2. Record pass/fail result.
3. Record why any required command was skipped.
4. Record whether failures are touched-code regressions or pre-existing issues.

## Suggested Sequence

1. pnpm lint
2. targeted tests if applicable
3. pnpm test for broader behavior changes
4. pnpm build for integration-sensitive or broad changes

## Failure Handling

1. If touched-code failure occurs, fix and re-run required gates.
2. If unrelated failure occurs, report it clearly and continue only if safe.
