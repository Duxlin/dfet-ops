export type Role = "super_admin" | "admin" | "hr" | "supervisor" | "staff";
export type EmploymentType = "employee" | "intern";
export type EmploymentStatus = "active" | "inactive" | "on_leave";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";
export type ReportPeriod = "daily" | "weekly";
export type ReportStatus = "submitted" | "approved" | "rejected";
export type AssetType =
  | "laptop"
  | "desktop"
  | "printer"
  | "phone"
  | "router"
  | "starlink"
  | "monitor"
  | "network"
  | "other";
export type AssetStatus = "available" | "assigned" | "maintenance" | "damaged" | "lost";
export type AssetCondition = "new" | "good" | "fair" | "poor";
export type MaintenanceType = "repair" | "preventive" | "replacement" | "inspection";
export type MaintenanceStatus = "open" | "in_progress" | "completed";

export type Permissions = {
  manageStaff: boolean;
  deleteStaff: boolean;
  assignTasks: boolean;
  viewAllTasks: boolean;
  assignAssets: boolean;
  manageAssets: boolean;
  reviewReports: boolean;
  viewAnalytics: boolean;
  viewAudit: boolean;
  exportData: boolean;
};

export type Department = { id: number; name: string };

export type Staff = {
  id: number;
  userId: string | null;
  staffId: string;
  fullName: string;
  email: string;
  phone: string | null;
  departmentId: number | null;
  departmentName: string | null;
  position: string | null;
  role: Role;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  dateJoined: string | null;
  profilePicture: string | null;
  createdAt: string;
};

export type Attachment = {
  id: number;
  entityType: string;
  entityId: number;
  filename: string;
  mimeType: string;
  dataUrl: string;
  uploadedBy: number | null;
  createdAt: string;
};

export type TaskComment = {
  id: number;
  taskId: number;
  staffId: number;
  authorName: string;
  body: string;
  createdAt: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string | null;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  assignees: { id: number; fullName: string; staffId: string }[];
  commentCount: number;
  attachmentCount: number;
};

export type ActivityReport = {
  id: number;
  staffId: number;
  staffName: string;
  staffCode: string;
  reportDate: string;
  period: ReportPeriod;
  tasksCompleted: string | null;
  challenges: string | null;
  status: ReportStatus;
  reviewerId: number | null;
  reviewerName: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type Asset = {
  id: number;
  assetCode: string;
  assetType: AssetType;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  purchaseDate: string | null;
  condition: AssetCondition;
  status: AssetStatus;
  location: string | null;
  notes: string | null;
  createdAt: string;
  assignedStaffId: number | null;
  assignedStaffName: string | null;
  assignedCustomer: string | null;
};

export type AssetAssignment = {
  id: number;
  assetId: number;
  assignedToType: "staff" | "customer";
  staffId: number | null;
  staffName: string | null;
  customerName: string | null;
  customerContact: string | null;
  location: string | null;
  assignedBy: number | null;
  assignedByName: string | null;
  assignedAt: string;
  returnedAt: string | null;
  notes: string | null;
};

export type MaintenanceRecord = {
  id: number;
  assetId: number;
  maintenanceDate: string;
  maintenanceType: MaintenanceType;
  issue: string | null;
  status: MaintenanceStatus;
  performedBy: string | null;
  notes: string | null;
  createdBy: number | null;
  createdAt: string;
};

export type AppNotification = {
  id: number;
  staffId: number;
  title: string;
  body: string | null;
  kind: string;
  entityType: string | null;
  entityId: number | null;
  readAt: string | null;
  createdAt: string;
};

export type AuditLog = {
  id: number;
  staffId: number | null;
  staffName: string | null;
  action: string;
  entityType: string | null;
  entityId: number | null;
  detail: string | null;
  createdAt: string;
};

export type DashboardStats = {
  totalEmployees: number;
  totalInterns: number;
  tasksAssigned: number;
  tasksCompleted: number;
  tasksInProgress: number;
  overdueTasks: number;
  pendingTasks: number;
  reportsSubmitted: number;
  reportsPendingApproval: number;
  reportsApproved: number;
  assetsTotal: number;
  assetsAssigned: number;
  assetsAvailable: number;
  unreadNotifications: number;
};

export type Me = {
  pending: boolean;
  staff: Staff | null;
  permissions: Permissions;
  unreadNotifications: number;
};
