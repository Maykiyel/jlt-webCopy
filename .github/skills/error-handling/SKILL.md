---
name: error-handling
description: "Design resilient error handling in React and Vite apps with API interceptors, localized error boundaries, and production error tracking. Use when requests mention API errors, retries, toasts, error boundaries, Sentry, or runtime failure handling."
argument-hint: 'Provide scope and strictness, for example: "auth API standard" or "quotations viewer strict"'
---

# Error Handling

## Purpose

Apply a consistent strategy for API failures, in-app runtime exceptions, and production error monitoring so failures are visible, contained, and recoverable.

## Use This Skill When

- Implementing API error behavior in services or client interceptors.
- Standardizing user-facing error notifications.
- Adding React error boundaries to prevent full-app crashes.
- Reviewing retry, token refresh, or unauthorized-session handling.
- Instrumenting or auditing production error tracking.

## Standards Library

Use these references as the source of truth while executing this skill.

1. Patterns and implementation guidance: [error handling guidelines](./references/error-handling-guidelines.md)
2. Execution and validation checklist: [error handling checklist](./references/error-handling-checklist.md)
3. Existing baseline in this repository: src/lib/api/client.ts, src/app/provider.tsx, src/app/routes/auth/LoginPage.tsx

## Workflow

1. Identify error sources by layer: API/network, domain logic, UI rendering, and unexpected runtime failures.
2. Normalize API errors through a central interceptor policy.
3. Map errors to user-facing messaging with actionable feedback where possible.
4. Handle authentication-related failures consistently (for example 401 logout and token-refresh flow if present).
5. Contain render-time crashes using localized error boundaries instead of a single global boundary only.
6. Capture unhandled and high-severity errors in production tracking tools.
7. Validate fallback UX, retry behavior, and recovery paths.
8. Report residual risk and observability gaps.

## Operating Modes

1. Quick pass: targeted fix for one error path and local validation.
2. Standard pass: interceptor policy plus boundary placement review in touched flow.
3. Strict pass: full pass including tracking instrumentation and failure scenario verification.

## Non-Negotiables

- API error handling must be centralized and predictable.
- Unauthorized states must fail closed and keep session state consistent.
- User-facing error messaging should be clear but must avoid leaking sensitive internals.
- Error boundaries should isolate failures to affected regions when feasible.
- Production errors must be observable with actionable context.
