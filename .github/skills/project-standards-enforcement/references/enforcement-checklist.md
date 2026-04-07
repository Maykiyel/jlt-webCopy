# Enforcement Checklist

Use this checklist for every implementation, refactor, bugfix, or review task.

## Intake and Scope Mapping

1. List touched files.
2. Tag each file as shared, feature, or app.
3. Confirm whether quotations scope is touched.
4. Confirm whether behavior is expected to change.

## Architecture and Placement

1. Domain logic is under src/features/<feature> unless truly shared.
2. Shared code is placed only in src/components, src/hooks, src/lib, src/stores, src/types, or src/utils.
3. App composition concerns stay in src/app.
4. Page/container files orchestrate flow; reusable logic is extracted to hooks/utils/components.
5. New feature-specific APIs are located in src/features/<feature>/services unless explicitly shared.

## Import Boundaries

1. Shared modules do not import from src/features or src/app.
2. Feature modules do not import from sibling features unless explicitly approved.
3. App layer may import from shared and features.
4. Prefer direct imports over barrel patterns when editing.
5. Validate no import direction regression against Shared -> Features -> App.

## Data and State Rules

1. Remote data uses React Query, not duplicated into Zustand.
2. Shared client app state uses domain-split Zustand stores with selector usage.
3. Forms use React Hook Form with Zod schemas as validation source of truth.
4. URL/query params are used for shareable navigation state.
5. Validation schemas are reused across form, preview, and submission paths where applicable.

## Safety and Scope

1. Preserve behavior/UI unless the request explicitly asks to change it.
2. Keep patch size minimal and avoid unrelated formatting churn.
3. Add comments only for genuinely non-obvious logic.
4. Validate touched files with lint/type/test commands appropriate to change scope.

## Verification Criteria

1. Mark each checklist section as pass or fail.
2. Record one concrete reason per failed item.
3. Record the exact command evidence used for validation gates.
4. If skipping a gate, include rationale and risk.
