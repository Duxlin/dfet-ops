import type { Permissions, Role } from "./types";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  hr: "HR",
  supervisor: "Supervisor",
  staff: "Staff",
};

export const ROLES: Role[] = ["super_admin", "admin", "hr", "supervisor", "staff"];

export function permissionsFor(role: Role): Permissions {
  const isLead = role === "super_admin" || role === "admin";
  return {
    manageStaff: isLead || role === "hr",
    deleteStaff: isLead,
    assignTasks: isLead || role === "supervisor",
    viewAllTasks: isLead || role === "supervisor" || role === "hr",
    assignAssets: isLead,
    manageAssets: isLead,
    reviewReports: isLead || role === "supervisor",
    viewAnalytics: isLead || role === "hr" || role === "supervisor",
    viewAudit: isLead,
    exportData: isLead || role === "hr" || role === "supervisor",
  };
}

export const NONE: Permissions = {
  manageStaff: false,
  deleteStaff: false,
  assignTasks: false,
  viewAllTasks: false,
  assignAssets: false,
  manageAssets: false,
  reviewReports: false,
  viewAnalytics: false,
  viewAudit: false,
  exportData: false,
};
