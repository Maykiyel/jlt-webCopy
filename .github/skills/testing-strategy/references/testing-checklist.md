# Testing Checklist

Use this checklist to implement and validate tests with consistent quality.

## 1. Scope and Risk

- Identify the user-facing behavior affected by the change.
- List failure risks (logic, wiring, routing, async state, backend contract).
- Decide if the risk is local (unit), feature-level (integration), or journey-level (e2e).

## 2. Test-Level Selection

- Integration is the default for feature behavior.
- Unit tests cover isolated complex logic and reusable shared utilities.
- E2E covers critical flows that must hold in production-like execution.

## 3. Test Design Quality

- Assertions describe user-visible behavior and outcomes.
- Tests avoid private implementation details where possible.
- Inputs and fixtures are realistic and deterministic.
- Flaky timing assumptions are removed.

## 4. API and Data Strategy

- Use MSW for deterministic API behavior when real backend access is not required.
- Mock at network boundaries rather than mocking deep implementation internals.
- Keep handler logic aligned with expected API contracts.

## 5. Integration and E2E Coverage

- Core happy path is covered.
- At least one meaningful failure/edge path is covered when risk justifies it.
- Critical navigation and data-loading boundaries are tested.

## 6. Validation Commands

Run the smallest relevant set first, then broaden:

1. `pnpm test`
2. `pnpm test:watch` (during local iteration)
3. Project lint/build gates when test-impacting code changes are broad.

## 7. Reporting

Include this summary after changes:

1. Behavior covered
2. Test levels used (unit/integration/e2e)
3. Commands run and result
4. Remaining risk or known gaps
