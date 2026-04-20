# JLT Agent Operating Guide

This `AGENTS.md` is intentionally lightweight and delegates detailed guidance to the `.agents/` directory.

## Source of Truth

For architecture, standards, and implementation workflows, **always consult `.agents/` first**.

- Global instructions: `.agents/copilot-instructions.md`
- Skill playbooks: `.agents/skills/*/SKILL.md`

If any content in this file appears to overlap with `.agents/` skill docs, treat the `.agents/` docs as the authoritative and more detailed source.

## Required Agent Workflow

Before making code changes:

1. Read this file.
2. Read `.agents/copilot-instructions.md`.
3. Select and apply the relevant skill(s) from `.agents/skills/` based on the task.
4. Follow the selected skill workflow exactly (including validation/check steps).

## Baseline Standards (Always Enforced)

Even when no single skill is an exact match, agents must still enforce these baseline rules:

1. Keep changes minimal, targeted, and behavior-safe unless behavior changes are explicitly requested.
2. Preserve feature-first architecture and unidirectional dependency flow (`Shared -> Features -> App`).
3. Prefer existing utilities/components over duplication.
4. Keep business/domain logic inside `src/features` unless it is truly shared.
5. Run appropriate validation for touched code (lint, typecheck, tests, or skill-recommended checks).

## Skill Routing Expectations

Use `.agents/skills/` as the primary routing mechanism:

- `project-structure` for module boundaries, import direction, and folder ownership.
- `performance-optimization` for rerenders, bundle/chunking, loading, and Web Vitals.
- `error-handling` for resilient API/runtime error flows and boundaries.
- `security-auth` for authentication, authorization, token handling, and OWASP-sensitive changes.
- `testing-strategy` for integration/e2e coverage and regression prevention.

If multiple concerns apply, combine the minimum necessary set of skills and execute them in a clear sequence.

## Final Check

Do not finalize work until you have confirmed:

- Relevant `.agents` skill instructions were actually applied.
- Changed code aligns with architecture and state-management standards in `.agents` docs.
- Validation has been run and results are reported clearly.
