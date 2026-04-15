import {
  AccountTree,
  Description,
  RequestQuote,
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { ComponentType } from "react";
import type { Role } from "@/types/roles";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToolItem {
  id: string;
  icon: ComponentType<{ width?: string | number; height?: string | number }>;
  label: string;
  path: string;
  allowedRoles?: Role[]; // Future-proofing for role restrictions
}

// ─── Configuration ────────────────────────────────────────────────────────────

export const TOOL_ITEMS: ToolItem[] = [
  {
    id: "services",
    icon: AccountTree,
    label: "List of Services",
    path: "/tools/services",
  },
  {
    id: "message-template",
    icon: Description,
    label: "Message Template",
    path: "/tools/messages",
  },
  {
    id: "quotation-templates",
    icon: RequestQuote,
    label: "Quotation Templates",
    path: "/tools/templates",
  },
];
