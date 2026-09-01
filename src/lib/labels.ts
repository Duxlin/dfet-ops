import type {
  AssetCondition,
  AssetStatus,
  AssetType,
  EmploymentStatus,
  EmploymentType,
  MaintenanceStatus,
  MaintenanceType,
  ReportStatus,
  TaskPriority,
  TaskStatus,
} from "./types";

export const EMPLOYMENT_TYPE: Record<EmploymentType, string> = {
  employee: "Employee",
  intern: "Intern",
};

export const EMPLOYMENT_STATUS: Record<EmploymentStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On leave",
};

export const TASK_PRIORITY: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const TASK_STATUS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  overdue: "Overdue",
};

export const REPORT_STATUS: Record<ReportStatus, string> = {
  submitted: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};

export const ASSET_TYPES: Record<AssetType, string> = {
  laptop: "Laptop",
  desktop: "Desktop",
  printer: "Printer",
  phone: "Phone",
  router: "Router",
  starlink: "Starlink kit",
  monitor: "Monitor",
  network: "Network device",
  other: "Other",
};

export const ASSET_STATUS: Record<AssetStatus, string> = {
  available: "Available",
  assigned: "Assigned",
  maintenance: "Under maintenance",
  damaged: "Damaged",
  lost: "Lost",
};

export const ASSET_CONDITION: Record<AssetCondition, string> = {
  new: "New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

export const MAINTENANCE_TYPE: Record<MaintenanceType, string> = {
  repair: "Repair",
  preventive: "Preventive",
  replacement: "Replacement",
  inspection: "Inspection",
};

export const MAINTENANCE_STATUS: Record<MaintenanceStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
};

export const ASSET_TYPE_PREFIX: Record<AssetType, string> = {
  laptop: "LT",
  desktop: "DT",
  printer: "PR",
  phone: "PH",
  router: "RT",
  starlink: "SL",
  monitor: "MN",
  network: "NW",
  other: "OT",
};
