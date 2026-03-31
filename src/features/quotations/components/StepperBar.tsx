import { UnstyledButton } from "@mantine/core";
import classes from "./StepperBar.module.css";

interface StepperBarProps {
  step: number;
  onStepClick: (index: number) => void;
}

const STEP_LABELS = [
  "QUOTATION DETAILS",
  "BILLING DETAILS",
  "TERMS AND CONDITION/CLOSING STATEMENT",
] as const;

export function StepperBar({ step, onStepClick }: StepperBarProps) {
  return (
    <div className={classes.root}>
      {STEP_LABELS.map((label, index) => {
        const isPast = index < step;
        const isActiveOrCompleted = index <= step;

        return (
          <UnstyledButton
            key={label}
            type="button"
            className={`${classes.tab} ${isActiveOrCompleted ? classes.active : classes.future} ${isPast ? classes.clickable : ""}`}
            onClick={() => {
              if (isPast) onStepClick(index);
            }}
          >
            {label}
          </UnstyledButton>
        );
      })}
    </div>
  );
}
