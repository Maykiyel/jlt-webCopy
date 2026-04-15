# Testing Guidelines

Use this guide to choose the right testing level and tooling for each change.

## Core Principle

Unit tests are useful, but the strongest confidence usually comes from integration and end-to-end tests that validate how real pieces work together.

## Test Types

### Unit Tests

Use for isolated logic and reusable utilities.

- Fastest feedback cycle.
- Good for pure transformations, mappers, and utility helpers.
- Useful for shared components with complex internal logic.

Unit tests are not enough by themselves to guarantee complete feature behavior.

### Integration Tests

Use as the default level for most feature work.

- Validate that multiple parts collaborate correctly (UI, hooks, state, and API layers).
- Catch broken boundaries and wiring issues that unit tests often miss.
- Provide strong confidence per maintenance cost for typical app features.

### End-to-End Tests

Use for critical user journeys and release confidence.

- Simulate real user interactions across the full app.
- Best for smoke coverage of key flows, routing, auth, and happy-path business actions.
- Higher cost than unit/integration, so keep scope intentional.

## Recommended Tooling

### Vitest

- Primary framework for unit and integration tests in Vite projects.
- Fast local feedback and straightforward CI usage.
- This repository already exposes `pnpm test` and `pnpm test:watch` scripts for Vitest.

### Testing Library

- Prefer user-centric assertions (what the user can see/do) instead of implementation internals.
- Query by role/text/label before reaching for brittle selectors.
- Assert behavior outcomes, not private component state.

### Playwright

- Use for e2e test automation.
- Local development often benefits from headed/browser mode for debugging.
- CI should usually run headless mode for speed and reliability.

### MSW

- Use for API mocking and prototyping when backend contracts are incomplete.
- Keep request/response behavior realistic so frontend logic is exercised through HTTP boundaries.
- Useful in both development and tests to avoid ad-hoc fetch mocking.

## Repository Baseline

- Existing test files: `tests/quotations/billing.test.ts` and `tests/quotations/billingPresentation.test.ts`.
- Existing scripts: `pnpm test` and `pnpm test:watch`.

## Practical Selection Rule

When deciding where a test belongs:

1. Start with integration if the behavior crosses component/hook/service boundaries.
2. Add unit tests for hard logic branches and shared pure helpers.
3. Add e2e tests for user-critical paths that must be validated in full-system conditions.
