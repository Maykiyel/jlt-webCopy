import {
  Dashboard,
  DiversityTwo,
  Box as BoxIcon,
  RequestQuote,
  ManageAccounts,
  FolderManaged,
} from "@nine-thirty-five/material-symbols-react/rounded";
import type { NavItem } from "./AppSidebarUtils";

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    icon: <Dashboard width="2rem" height="2rem" />,
    label: "Dashboard",
    path: "/",
  },
  {
    id: "leads",
    icon: <DiversityTwo width="2rem" height="2rem" />,
    label: "Leads",
    subItems: [
      { label: "Queries", path: "/leads/queries" },
      { label: "New", path: "/leads/new" },
      { label: "Replied", path: "/leads/replied" },
    ],
  },
  {
    id: "shipments",
    icon: <BoxIcon width="2rem" height="2rem" />,
    label: "Shipments",
    subItems: [
      {
        label: "Logistics",
        path: "/shipments/logistics",
        subItems: [
          { label: "Ongoing", path: "/shipments/logistics/ongoing" },
          { label: "Delivered", path: "/shipments/logistics/delivered" },
        ],
      },
      {
        label: "Regulatory",
        path: "/shipments/regulatory",
        subItems: [
          { label: "Permits", path: "/shipments/regulatory/permits" },
          { label: "Licenses", path: "/shipments/regulatory/licenses" },
        ],
      },
    ],
  },
  {
    id: "quotations",
    icon: <RequestQuote width="2rem" height="2rem" />,
    label: "Quotations",
    subItems: [
      { label: "Requests", path: "/quotations/requested" },
      { label: "Responded", path: "/quotations/responded" },
      { label: "Accepted", path: "/quotations/accepted" },
      { label: "Discarded", path: "/quotations/discarded" },
    ],
  },
  {
    id: "accounts",
    icon: <ManageAccounts width="2rem" height="2rem" />,
    label: "Accounts",
    subItems: [
      { label: "Clients", path: "/accounts/clients" },
      { label: "Employees", path: "/accounts/employees" },
    ],
  },
  {
    id: "tools",
    icon: <FolderManaged width="2rem" height="2rem" />,
    label: "Tools",
    subItems: [
      { label: "Services", path: "/tools/services" },
      { label: "Templates", path: "/tools/templates" },
      { label: "Messages", path: "/tools/messages" },
    ],
  },
];

export const BTN_HEIGHT_REM = 5;
export const PILL_HEIGHT_REM = 3.5;
export const RAIL_PADDING_TOP_REM = 1.125;
export const PANEL_BASE_PADDING_REM = 1;
export const PANEL_INDENT_STEP_REM = 1;
