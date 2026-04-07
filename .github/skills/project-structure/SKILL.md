---
name: project-structure
description: "Enforce a scalable feature-first project structure with strict module boundaries, direct-import policy, and unidirectional architecture (Shared -> Features -> App). Use when requests mention folder organization, feature structure, cross-feature imports, or ESLint architecture rules."
argument-hint: 'Provide scope and strictness, for example: "src/features/shipments standard" or "src/app strict"'
---

# Project Structure Enforcement

## Purpose

Apply a strict, repeatable workflow for maintaining a clean project structure that scales safely as the codebase grows.

## Standards Library

Use these references as the source of truth while executing this skill.

1. Canonical project structure: [standards canonical](./references/standards-canonical.md)
2. Structure and boundary audit checks: [enforcement checklist](./references/enforcement-checklist.md)
3. ESLint boundary examples for architecture rules: [ESLint boundary zones](./references/eslint-boundary-zones.md)
4. Validation gates and command sequencing: [validation command matrix](./references/validation-command-matrix.md)
5. Final report contract: [result format](./references/result-format.md)

## Use This Skill When

- Implementing or refactoring code in src.
- Reviewing pull requests or local diffs for structure compliance.
- Verifying feature boundaries and import direction.
- Designing or enforcing ESLint import restrictions.

## Enforcement Workflow

1. Load [standards canonical](./references/standards-canonical.md) to anchor all structure and dependency decisions.
2. Classify scope by touched paths: shared layer, feature layer, app layer, or multi-layer.
3. Run [enforcement checklist](./references/enforcement-checklist.md) and record pass/fail for each section.
4. Apply or verify ESLint boundary zones using [ESLint boundary zones](./references/eslint-boundary-zones.md).
5. Keep change sets minimal while correcting placement and import-direction violations.
6. Run validation commands using [validation command matrix](./references/validation-command-matrix.md).
7. If checks fail, fix touched-code regressions first, then re-run required gates.
8. Produce final output using [result format](./references/result-format.md), including residual risk and assumptions.

## Operating Modes

1. Quick audit: run placement and import-boundary checks plus lint-focused validation for low-risk edits.
2. Standard enforcement: run full structure checklist plus lint and targeted tests for most tasks.
3. Strict enforcement: run all checklist sections, ESLint boundary audits, lint, tests, and build for high-risk refactors.

## Non-Negotiables

- Keep dependency flow Shared -> Features -> App.
- Keep most domain logic inside src/features.
- Avoid cross-feature imports unless explicitly approved.
- Prefer direct imports over barrel files.
- Compose features at src/app rather than coupling features together.
- Keep patches scoped and avoid broad rewrites when extraction solves the issue.

## Escalation Rules

- If standards conflict with a user request, implement the request safely and explicitly call out the conflict.
- If lint/test/build fails and the failure is related to touched code, fix before finalizing.
- If failures are unrelated to touched code, report them clearly as pre-existing or external blockers.
- If a requested change would introduce architectural debt, propose a compliant alternative before completing.
