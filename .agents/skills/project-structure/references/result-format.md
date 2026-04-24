# Result Format

Use this output structure after running the enforcement workflow.

## Output Order (Required)

1. Findings
2. Open Questions
3. Change Summary
4. Validation Summary
5. Optimistic/Global Decisions
6. Residual Risk

## Findings

List issues first, ordered by severity.

Format each finding as:

- Severity: high | medium | low
- Location: path and line
- Problem: what violates the standard
- Impact: user/runtime/maintainability risk
- Fix: precise remediation

### Severity Rubric

1. high: behavior break, data integrity risk, security risk, or architecture boundary violation.
2. medium: maintainability/performance regression with non-trivial impact.
3. low: minor clarity, consistency, or non-blocking standards drift.

## Open Questions

List assumptions or conflicts requiring user confirmation.

## Change Summary

Give a short summary only after findings and open questions.

## Validation Summary

Report exactly which commands were run and pass/fail status.

Include command lines and whether each gate is required or optional for the given scope.

## Optimistic/Global Decisions

Always include:

1. Optimistic mutation decision: used, or not used with reason.
2. Rollback/reconciliation evidence when optimistic behavior is used.
3. Global remediation decision: centralized, or local-only with rationale.
4. Test/verification evidence that proves the decision.

## Residual Risk

State what was not verified and why.

If no findings exist, state that explicitly and still include residual risk/testing gaps.
