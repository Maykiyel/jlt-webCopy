import type { User, UserResource } from "@/types/api";
import { getUserRole } from "@/lib/mappers/user.mapper";
import { ROLES } from "@/types/roles";

export const permissions = {
  // Quotations
  canCreateQuotation: (user: User | UserResource) => {
    const role = getUserRole(user);
    const isAS =
      role === ROLES.ACCOUNT_SPECIALIST ||
      role === ROLES.LEAD_ACCOUNT_SPECIALIST;
    return role === ROLES.CLIENT || isAS;
  },

  canEditQuotation: (user: User | UserResource) => {
    const role = getUserRole(user);
    const isAS =
      role === ROLES.ACCOUNT_SPECIALIST ||
      role === ROLES.LEAD_ACCOUNT_SPECIALIST;
    return isAS;
  },

  canDeleteQuotation: (user: User | UserResource) => {
    const role = getUserRole(user);
    const isAS =
      role === ROLES.ACCOUNT_SPECIALIST ||
      role === ROLES.LEAD_ACCOUNT_SPECIALIST;
    return isAS;
  },

  // Articles
  canCreateArticle: (user: User | UserResource) => {
    return getUserRole(user) === ROLES.MARKETING;
  },

  canEditArticle: (user: User | UserResource) => {
    return getUserRole(user) === ROLES.MARKETING;
  },

  canDeleteArticle: (user: User | UserResource) => {
    return getUserRole(user) === ROLES.MARKETING;
  },

  // Accounts/Users
  canManageUsers: (user: User | UserResource) => {
    return getUserRole(user) === ROLES.HUMAN_RESOURCE;
  },

  canViewAllQueries: (user: User | UserResource) => {
    const role = getUserRole(user);
    const isAS =
      role === ROLES.ACCOUNT_SPECIALIST ||
      role === ROLES.LEAD_ACCOUNT_SPECIALIST;
    return isAS;
  },

  // Dashboards
  canViewAnalytics: (user: User | UserResource) => {
    const role = getUserRole(user);
    return (
      role === ROLES.ACCOUNT_SPECIALIST ||
      role === ROLES.LEAD_ACCOUNT_SPECIALIST ||
      role === ROLES.MARKETING ||
      role === ROLES.HUMAN_RESOURCE
    );
  },
};
