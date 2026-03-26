export const ROLES = {
  CLIENT: "Client",
  ACCOUNT_SPECIALIST: "Account Specialist",
  LEAD_ACCOUNT_SPECIALIST: "Lead Account Specialist",
  MARKETING: "Marketing",
  HUMAN_RESOURCE: "Human Resource",
  IT: "IT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
