# Security Guidelines

Use this guide for practical client-side security decisions around authentication and authorization.

## Core Principle

Client-side security controls improve user experience and reduce accidental exposure, but server-side checks remain mandatory for true protection of resources.

## Authentication

Authentication verifies identity, commonly via JWT-based flows in SPAs.

Typical flow:

1. User logs in and receives an access token.
2. App attaches token to authenticated requests, usually via Authorization header or cookie.
3. App treats user as authenticated when a valid user context exists.

## Token Storage Tradeoffs

### In-memory state only

- Most resistant to persistence-based theft.
- Lost on refresh unless paired with refresh/session mechanism.

### localStorage or sessionStorage

- Persists across reloads (localStorage across sessions, sessionStorage per tab).
- Exposed to XSS if malicious script executes in page context.

### Cookies (preferred when server supports HttpOnly)

- HttpOnly cookies are not accessible from client JavaScript.
- Better protection against token extraction via XSS.
- Requires strong server configuration and CSRF strategy where applicable.

## XSS Defense and Input Handling

- Sanitize untrusted user input before rendering.
- Avoid rendering untrusted HTML directly.
- If HTML rendering is required, sanitize first and keep the sanitizer policy strict.
- Treat XSS prevention as a system-wide requirement, not only an auth concern.

Reference risk catalog:

- OWASP Top 10 Client-Side Security Risks.

## Handling User Data

User information is global application state and should be available across protected flows.

Recommended approaches:

- React Query based auth wrapper patterns (for example react-query-auth style setup).
- React context plus hooks for low/medium-complexity auth state.
- Selector-based state management libraries for broader app coordination.

The app commonly assumes authenticated state when a valid user object is present.

## Authorization

Authorization verifies whether authenticated users may access specific resources or actions.

### RBAC (Role-Based Access Control)

- Restrict access by role groups (for example USER vs ADMIN-like roles).
- Commonly enforced at route boundaries and major feature entry points.

### PBAC (Permission/Policy-Based Access Control)

- Add resource-level checks when role checks are insufficient.
- Example: only the resource owner can edit/delete their own content.
- Use policy functions to centralize decision logic and avoid duplicated inline rules.

## Repository Baseline

Current implementation references in this repository:

- src/stores/authStore.ts: auth state and token/user persistence.
- src/lib/api/client.ts: request interceptor token attachment and 401 handling.
- src/components/guards/ProtectedRoute.tsx: authenticated route protection.
- src/components/guards/RoleGuard.tsx: role-gated rendering.
- src/lib/permissions.ts: centralized permission helpers for feature actions.

## Practical Security Direction

1. Keep auth flows centralized and explicit.
2. Document token storage decision and known tradeoffs.
3. Combine route guards, role checks, and action-level policy checks.
4. Sanitize all untrusted content before render.
5. Reconfirm server-side enforcement for all sensitive operations.
