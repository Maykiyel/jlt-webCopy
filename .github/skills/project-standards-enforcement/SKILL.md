---
name: project-standards-enforcement
description: "Enforce JLT Web architecture and coding standards for implementation, refactor, bugfix, and review tasks. Use when requests mention standards, architecture compliance, feature boundaries, AGENTS rules, quotations consistency, lint/type/test gates, or code review quality checks."
argument-hint: 'Provide scope and strictness, for example: "src/features/shipments strict" or "quotations quick audit"'
---

# Project Standards Enforcement

## Purpose

Apply a strict, repeatable workflow for changes in this repository so standards are enforced consistently instead of relying on ad-hoc interpretation.

## Standards Library

Use these references as the source of truth while executing this skill.

1. Canonical standards mirror: [standards-canonical](./references/standards-canonical.md)
2. Architecture and boundary audit checks: [enforcement checklist](./references/enforcement-checklist.md)
3. Quotations-specific quality gates: [quotations acceptance gates](./references/quotations-acceptance-gates.md)
4. Validation gates and command sequencing: [validation command matrix](./references/validation-command-matrix.md)
5. Final report contract: [result format](./references/result-format.md)

## Use This Skill When

- Implementing or refactoring code in src.
- Reviewing pull requests or local diffs for standards compliance.
- Verifying architecture boundaries and import direction.
- Touching quotations flow where preview/PDF consistency must hold.

## Enforcement Workflow

1. Load [standards-canonical](./references/standards-canonical.md) to anchor all decisions to repository standards.
2. Classify scope by touched paths: shared layer, feature layer, app layer, or multi-layer.
3. Run [enforcement checklist](./references/enforcement-checklist.md) and record pass/fail for each section.
4. When quotations files are touched, run [quotations acceptance gates](./references/quotations-acceptance-gates.md) and require explicit gate evidence.
5. Make the minimum safe change set that satisfies the user request and all applicable standards.
6. Run validation commands using [validation command matrix](./references/validation-command-matrix.md).
7. If checks fail, fix touched-code regressions first, then re-run required gates.
8. Produce final output using [result format](./references/result-format.md), including residual risk and assumptions.

## Operating Modes

1. Quick audit: run architecture checks plus lint-focused validation for low-risk, local edits.
2. Standard enforcement: run architecture checks plus lint and targeted tests for most tasks.
3. Strict enforcement: run full checklist, quotations gates when relevant, lint, tests, and build for high-risk refactors.

## Non-Negotiables

- Keep dependency flow Shared -> Features -> App.
- Avoid cross-feature imports unless explicitly approved.
- Keep feature-specific API logic in src/features/<feature>/services.
- Keep preview/PDF derivations aligned in quotations.
- Do not perform broad rewrites when a scoped extraction solves the issue.

## Escalation Rules

- If standards conflict with a user request, implement the request safely and explicitly call out the conflict.
- If lint/test/build fails and the failure is related to touched code, fix before finalizing.
- If failures are unrelated to touched code, report them clearly as pre-existing or external blockers.
- If a requested change would introduce architectural debt, propose a compliant alternative before completing.
