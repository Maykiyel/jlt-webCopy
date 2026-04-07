# Security Checklist

Use this checklist to implement and audit authentication and authorization safely.

## 1. Scope and Threat Surface

- Identify the protected resource and who should access it.
- Confirm trust boundary between client checks and server enforcement.
- Document abuse scenarios: token theft, privilege escalation, unauthorized action, XSS.

## 2. Authentication Flow

- Login path correctly initializes user and token state.
- Logout path clears user and token state fully.
- Token is attached only when present and valid.
- Unauthorized responses fail closed (for example session invalidation on 401).

## 3. Token Storage Decision

- Storage method is explicit and justified.
- If storage is localStorage/sessionStorage, XSS mitigations are reviewed.
- If cookie-based, HttpOnly/Secure/SameSite behavior is verified with backend contract.

## 4. User State Management

- Authenticated user context is globally accessible where needed.
- App behavior for missing/stale user state is defined.
- Refresh/hydration behavior is deterministic on app startup.

## 5. Authorization Enforcement

- Route-level access is protected.
- Role checks are centralized and reused.
- Action-level checks exist for sensitive operations.
- Resource ownership or policy checks are implemented when required.

## 6. XSS and Rendering Safety

- Untrusted inputs are sanitized before rendering.
- Direct HTML injection paths are reviewed and restricted.
- Security review includes fields that may contain rich text or user-generated content.

## 7. Validation

Run minimum required quality gates:

1. pnpm lint
2. pnpm test
3. pnpm build

If adding auth/security logic tests, include focused regression tests for allowed and denied paths.

## 8. Reporting

Capture and report:

1. Security behavior covered
2. Risks mitigated and residual risks
3. Server-side assumptions and dependencies
4. Validation commands and results
