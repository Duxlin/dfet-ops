import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { asNum, iso, isoOrNull } from "@/lib/format";
import type {
  ActivityReport,
  AppNotification,
  AuditLog,
  DashboardStats,
  Department,
  EmploymentStatus,
  EmploymentType,
  Me,
  Role,
  Staff,
  Task,
} from "@/lib/types";
import {
  allocateStaffCode,
  audit,
  mapStaff,
  markOverdue,
  requireActor,
  requirePerm,
  resolveMe,
} from "./authz";
import { ensureDemoAdmin } from "./demo-admin";

function fail(message: string): never {
  throw new Error(message);
}

export const prepareWorkspace = createServerFn({ method: "GET" }).handler(async () => {
  await ensureDemoAdmin();
  return { ok: true as const };
});

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Me> => resolveMe(context.userId));

export const listDepartments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Department[]> => {
    await requireActor(context.userId);
    const sql = await getSql();
    return sql.query<Department>(`select id, name from departments order by name`);
  });

type StaffListInput = { q?: string; role?: string; status?: string; type?: string; departmentId?: number | null };

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: StaffListInput) => d)
  .handler(async ({ context, data }): Promise<Staff[]> => {
    await requireActor(context.userId);
    const sql = await getSql();
    const rows = await sql.query<Parameters<typeof mapStaff>[0]>(
      `select s.id, s.user_id, s.staff_id, s.full_name, s.email, s.phone,
              s.department_id, d.name as department_name, s.position, s.role,
              s.employment_type, s.employment_status, s.date_joined::text as date_joined,
              s.profile_picture, s.created_at
         from staff s left join departments d on d.id = s.department_id
        where ($1 = '' or s.full_name ilike '%'||$1||'%' or s.email ilike '%'||$1||'%' or s.staff_id ilike '%'||$1||'%')
          and ($2 = '' or s.role = $2)
          and ($3 = '' or s.employment_status = $3)
          and ($4 = '' or s.employment_type = $4)
        order by s.full_name`,
      [data.q ?? "", data.role ?? "", data.status ?? "", data.type ?? ""],
    );
    return rows.map(mapStaff);
  });

export const getStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }): Promise<Staff> => {
    await requireActor(context.userId);
    const sql = await getSql();
    const rows = await sql.query<Parameters<typeof mapStaff>[0]>(
      `select s.id, s.user_id, s.staff_id, s.full_name, s.email, s.phone,
              s.department_id, d.name as department_name, s.position, s.role,
              s.employment_type, s.employment_status, s.date_joined::text as date_joined,
              s.profile_picture, s.created_at
         from staff s left join departments d on d.id = s.department_id where s.id = $1`,
      [id],
    );
    if (!rows[0]) fail("Staff member not found");
    return mapStaff(rows[0]);
  });

export type StaffWrite = {
  fullName: string;
  email: string;
  phone?: string;
  departmentId?: number | null;
  position?: string;
  role: Role;
  employmentType: EmploymentType;
  employmentStatus?: EmploymentStatus;
  dateJoined?: string | null;
  profilePicture?: string | null;
};

export const createStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: StaffWrite) => d)
  .handler(async ({ context, data }): Promise<Staff> => {
    const actor = await requireActor(context.userId);
    requirePerm(actor, "manageStaff");
    const sql = await getSql();
    const code = await allocateStaffCode(sql);
    const ins = await sql.query<{ id: number }>(
      `insert into staff (staff_id, full_name, email, phone, department_id, position, role, employment_type, employment_status, date_joined, profile_picture)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id`,
      [code, data.fullName.trim(), data.email.trim().toLowerCase(), data.phone?.trim() || null, data.departmentId ?? null, data.position?.trim() || null, data.role, data.employmentType, data.employmentStatus ?? "active", data.dateJoined || null, data.profilePicture || null],
    );
    await audit(sql, actor.staff.id, "staff.create", "staff", ins[0]!.id, data.fullName);
    return getStaff({ data: ins[0]!.id });
  });

export const updateStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: StaffWrite & { id: number }) => d)
  .handler(async ({ context, data }): Promise<Staff> => {
    const actor = await requireActor(context.userId);
    const isSelf = actor.staff.id === data.id;
    if (!isSelf) requirePerm(actor, "manageStaff");
    const sql = await getSql();
    if (isSelf && !actor.permissions.manageStaff) {
      await sql.query(`update staff set phone = $1, profile_picture = coalesce($2, profile_picture), updated_at = now() where id = $3`, [data.phone?.trim() || null, data.profilePicture || null, data.id]);
      return getStaff({ data: data.id });
    }
    await sql.query(
      `update staff set full_name = $1, email = $2, phone = $3, department_id = $4, position = $5, role = $6, employment_type = $7, employment_status = $8, date_joined = $9, profile_picture = coalesce($10, profile_picture), updated_at = now() where id = $11`,
      [data.fullName.trim(), data.email.trim().toLowerCase(), data.phone?.trim() || null, data.departmentId ?? null, data.position?.trim() || null, data.role, data.employmentType, data.employmentStatus ?? "active", data.dateJoined || null, data.profilePicture || null, data.id],
    );
    await audit(sql, actor.staff.id, "staff.update", "staff", data.id, data.fullName);
    return getStaff({ data: data.id });
  });

export const setStaffStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number; status: EmploymentStatus }) => d)
  .handler(async ({ context, data }): Promise<Staff> => {
    const actor = await requireActor(context.userId);
    requirePerm(actor, "manageStaff");
    const sql = await getSql();
    await sql.query(`update staff set employment_status = $1, updated_at = now() where id = $2`, [data.status, data.id]);
    return getStaff({ data: data.id });
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AppNotification[]> => {
    const actor = await requireActor(context.userId);
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(`select * from notifications where staff_id = $1 order by created_at desc limit 80`, [actor.staff.id]);
    return rows.map((r): AppNotification => ({
      id: asNum(r.id), staffId: asNum(r.staff_id), title: String(r.title), body: (r.body as string) ?? null,
      kind: String(r.kind), entityType: (r.entity_type as string) ?? null, entityId: r.entity_id == null ? null : asNum(r.entity_id),
      readAt: isoOrNull(r.read_at), createdAt: iso(r.created_at),
    }));
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { ids?: number[] }) => d)
  .handler(async ({ context }): Promise<void> => {
    const actor = await requireActor(context.userId);
    const sql = await getSql();
    await sql.query(`update notifications set read_at = now() where staff_id = $1 and read_at is null`, [actor.staff.id]);
  });

export const listAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { q?: string }) => d)
  .handler(async ({ context, data }): Promise<AuditLog[]> => {
    const actor = await requireActor(context.userId);
    requirePerm(actor, "viewAudit");
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      `select a.*, s.full_name as staff_name from audit_logs a left join staff s on s.id = a.staff_id
        where ($1 = '' or a.action ilike '%'||$1||'%' or coalesce(a.detail,'') ilike '%'||$1||'%')
        order by a.created_at desc limit 200`,
      [data.q ?? ""],
    );
    return rows.map((r): AuditLog => ({
      id: asNum(r.id), staffId: r.staff_id == null ? null : asNum(r.staff_id), staffName: (r.staff_name as string) ?? null,
      action: String(r.action), entityType: (r.entity_type as string) ?? null, entityId: r.entity_id == null ? null : asNum(r.entity_id),
      detail: (r.detail as string) ?? null, createdAt: iso(r.created_at),
    }));
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ stats: DashboardStats; recentTasks: Task[]; recentReports: ActivityReport[]; overdue: Task[] }> => {
    const actor = await requireActor(context.userId);
    const sql = await getSql();
    await markOverdue(sql);
    const one = async (q: string, params: unknown[] = []) => asNum((await sql.query<{ n: number }>(q, params))[0]?.n);
    const stats: DashboardStats = {
      totalEmployees: await one(`select count(*)::int as n from staff where employment_type = 'employee' and employment_status <> 'inactive'`),
      totalInterns: await one(`select count(*)::int as n from staff where employment_type = 'intern' and employment_status <> 'inactive'`),
      tasksAssigned: await one(`select count(*)::int as n from tasks`),
      tasksCompleted: await one(`select count(*)::int as n from tasks where status = 'completed'`),
      tasksInProgress: await one(`select count(*)::int as n from tasks where status = 'in_progress'`),
      overdueTasks: await one(`select count(*)::int as n from tasks where status = 'overdue'`),
      pendingTasks: await one(`select count(*)::int as n from tasks where status = 'pending'`),
      reportsSubmitted: await one(`select count(*)::int as n from activity_reports`),
      reportsPendingApproval: await one(`select count(*)::int as n from activity_reports where status = 'submitted'`),
      reportsApproved: await one(`select count(*)::int as n from activity_reports where status = 'approved'`),
      assetsTotal: await one(`select count(*)::int as n from assets`),
      assetsAssigned: await one(`select count(*)::int as n from assets where status = 'assigned'`),
      assetsAvailable: await one(`select count(*)::int as n from assets where status = 'available'`),
      unreadNotifications: await one(`select count(*)::int as n from notifications where staff_id = $1 and read_at is null`, [actor.staff.id]),
    };
    return { stats, recentTasks: [], recentReports: [], overdue: [] };
  });

export const listTasks = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async (): Promise<Task[]> => []);
export const getTask = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id: number) => id).handler(async () => fail("Not found"));
export const createTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const updateTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const setTaskStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const addTaskComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const addAttachment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const listReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async (): Promise<ActivityReport[]> => []);
export const submitReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const reviewReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const listAssets = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => []);
export const getAsset = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id: number) => id).handler(async () => fail("Not found"));
export const createAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const updateAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const assignAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const returnAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const addMaintenance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
export const updateMaintenanceStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: Record<string, unknown>) => d).handler(async () => fail("Not ready"));
