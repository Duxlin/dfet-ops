import { getSql, type Sql } from "@/lib/db";
import { asNum, iso, isoOrNull } from "@/lib/format";
import { NONE, permissionsFor } from "@/lib/roles";
import type { Me, Permissions, Role, Staff } from "@/lib/types";

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "You do not have permission to do that.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

type UserRow = { id: string; name: string; email: string; image: string | null };

type StaffRow = {
  id: number;
  user_id: string | null;
  staff_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  department_id: number | null;
  department_name: string | null;
  position: string | null;
  role: string;
  employment_type: string;
  employment_status: string;
  date_joined: string | null;
  profile_picture: string | null;
  created_at: unknown;
};

const STAFF_SELECT = `
  s.id, s.user_id, s.staff_id, s.full_name, s.email, s.phone,
  s.department_id, d.name as department_name, s.position, s.role,
  s.employment_type, s.employment_status, s.date_joined::text as date_joined,
  s.profile_picture, s.created_at
`;

export function mapStaff(row: StaffRow): Staff {
  return {
    id: asNum(row.id),
    userId: row.user_id,
    staffId: row.staff_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    departmentId: row.department_id == null ? null : asNum(row.department_id),
    departmentName: row.department_name,
    position: row.position,
    role: row.role as Role,
    employmentType: row.employment_type as Staff["employmentType"],
    employmentStatus: row.employment_status as Staff["employmentStatus"],
    dateJoined: isoOrNull(row.date_joined),
    profilePicture: row.profile_picture,
    createdAt: iso(row.created_at),
  };
}

export type Actor = {
  userId: string;
  staff: Staff;
  permissions: Permissions;
};

async function loadStaffByUser(sql: Sql, userId: string): Promise<StaffRow | undefined> {
  const rows = await sql.query<StaffRow>(
    `select ${STAFF_SELECT} from staff s left join departments d on d.id = s.department_id where s.user_id = $1 limit 1`,
    [userId],
  );
  return rows[0];
}

async function loadStaffByEmail(sql: Sql, email: string): Promise<StaffRow | undefined> {
  const rows = await sql.query<StaffRow>(
    `select ${STAFF_SELECT} from staff s left join departments d on d.id = s.department_id where lower(s.email) = lower($1) limit 1`,
    [email],
  );
  return rows[0];
}

export async function resolveMe(userId: string): Promise<Me> {
  const sql = await getSql();
  await markOverdue(sql);
  const users = await sql.query<UserRow>(`select id, name, email, image from "user" where id = $1 limit 1`, [userId]);
  const user = users[0];
  const email = user?.email ?? "";
  const name = user?.name || email.split("@")[0] || "Staff member";
  let row = await loadStaffByUser(sql, userId);
  if (!row && email) {
    const byEmail = await loadStaffByEmail(sql, email);
    if (byEmail) {
      await sql.query(`update staff set user_id = $1, updated_at = now() where id = $2 and user_id is null`, [userId, byEmail.id]);
      row = await loadStaffByUser(sql, userId);
    }
  }
  if (!row) {
    const linked = await sql.query<{ n: number }>(`select count(*)::int as n from staff where user_id is not null`);
    const linkedN = asNum(linked[0]?.n);
    if (linkedN === 0) {
      const orphan = await sql.query<StaffRow>(
        `select ${STAFF_SELECT} from staff s left join departments d on d.id = s.department_id
          where s.role = 'super_admin' and s.user_id is null order by s.id limit 1`,
      );
      if (orphan[0]) {
        await sql.query(
          `update staff set user_id = $1, email = coalesce(nullif($2, ''), email), full_name = $3,
                  profile_picture = coalesce($4, profile_picture), updated_at = now() where id = $5`,
          [userId, email, name, user?.image ?? null, orphan[0].id],
        );
      } else {
        await bootstrapFirstAdmin(sql, userId, name, email, user?.image ?? null);
      }
      row = await loadStaffByUser(sql, userId);
    } else if (email || name) {
      row = await provisionJoinedStaff(sql, userId, name, email, user?.image ?? null);
    }
  }
  if (!row) return { pending: true, staff: null, permissions: NONE, unreadNotifications: 0 };
  const staff = mapStaff(row);
  const unread = await sql.query<{ n: number }>(`select count(*)::int as n from notifications where staff_id = $1 and read_at is null`, [staff.id]);
  return { pending: false, staff, permissions: permissionsFor(staff.role), unreadNotifications: asNum(unread[0]?.n) };
}

export async function requireActor(userId: string): Promise<Actor> {
  const me = await resolveMe(userId);
  if (!me.staff) throw new ForbiddenError("Your account is waiting for an administrator to grant access.");
  if (me.staff.employmentStatus === "inactive") throw new ForbiddenError("This account has been deactivated. Contact an administrator.");
  return { userId, staff: me.staff, permissions: me.permissions };
}

export function requirePerm(actor: Actor, key: keyof Permissions): void {
  if (!actor.permissions[key]) throw new ForbiddenError();
}

export async function audit(sql: Sql, staffId: number | null, action: string, entityType?: string, entityId?: number, detail?: string): Promise<void> {
  await sql.query(`insert into audit_logs (staff_id, action, entity_type, entity_id, detail) values ($1,$2,$3,$4,$5)`, [staffId, action, entityType ?? null, entityId ?? null, detail ?? null]);
}

export async function notify(sql: Sql, staffId: number, title: string, body: string, kind: string, entityType?: string, entityId?: number): Promise<void> {
  await sql.query(`insert into notifications (staff_id, title, body, kind, entity_type, entity_id) values ($1,$2,$3,$4,$5,$6)`, [staffId, title, body, kind, entityType ?? null, entityId ?? null]);
}

export async function notifyMany(sql: Sql, staffIds: number[], title: string, body: string, kind: string, entityType?: string, entityId?: number): Promise<void> {
  for (const id of staffIds) await notify(sql, id, title, body, kind, entityType, entityId);
}

export async function markOverdue(sql: Sql): Promise<void> {
  const overdue = await sql.query<{ id: number }>(
    `update tasks set status = 'overdue', updated_at = now()
     where status in ('pending','in_progress') and deadline is not null and deadline < now() returning id`,
  );
  for (const t of overdue) {
    const assignees = await sql.query<{ staff_id: number }>(`select staff_id from task_assignees where task_id = $1`, [t.id]);
    const managers = await sql.query<{ id: number }>(`select id from staff where role in ('super_admin','admin','supervisor') and employment_status = 'active'`);
    const ids = [...new Set([...assignees.map((a) => a.staff_id), ...managers.map((m) => m.id)])];
    await notifyMany(sql, ids, "Task overdue", "A task has passed its deadline and was marked overdue.", "overdue", "task", t.id);
  }
}

async function nextStaffCode(sql: Sql): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await sql.query<{ n: number }>(`select count(*)::int as n from staff where staff_id like $1`, [`DFET-${year}-%`]);
  return `DFET-${year}-${String(asNum(rows[0]?.n) + 1).padStart(4, "0")}`;
}

export async function bootstrapFirstAdmin(sql: Sql, userId: string, name: string, email: string, image: string | null): Promise<StaffRow> {
  const code = await nextStaffCode(sql);
  const dept = await sql.query<{ id: number }>(`select id from departments where name = 'Administration' limit 1`);
  const inserted = await sql.query<{ id: number }>(
    `insert into staff (user_id, staff_id, full_name, email, department_id, position, role, employment_type, employment_status, date_joined, profile_picture)
     values ($1,$2,$3,$4,$5,$6,'super_admin','employee','active', current_date, $7) returning id`,
    [userId, code, name, email || `${userId}@dfet.internal`, dept[0]?.id ?? null, "Managing Director", image],
  );
  const id = inserted[0]!.id;
  await audit(sql, id, "bootstrap", "staff", id, "First Super Admin created");
  await seedDemoIfNeeded(sql, id);
  const row = await loadStaffByUser(sql, userId);
  if (!row) throw new Error("Failed to bootstrap administrator");
  return row;
}

export async function allocateStaffCode(sql: Sql): Promise<string> {
  return nextStaffCode(sql);
}

async function provisionJoinedStaff(sql: Sql, userId: string, name: string, email: string, image: string | null): Promise<StaffRow> {
  const code = await nextStaffCode(sql);
  const dept = await sql.query<{ id: number }>(`select id from departments where name = 'Administration' limit 1`);
  const safeEmail = email || `${userId.slice(0, 8)}@dfet.internal`;
  await sql.query(
    `insert into staff (user_id, staff_id, full_name, email, department_id, position, role, employment_type, employment_status, date_joined, profile_picture)
     values ($1,$2,$3,$4,$5,$6,'staff','employee','active', current_date, $7)`,
    [userId, code, name, safeEmail, dept[0]?.id ?? null, "Staff", image],
  );
  const row = await loadStaffByUser(sql, userId);
  if (!row) throw new Error("Failed to provision staff profile");
  await audit(sql, row.id, "staff.auto_join", "staff", row.id, name);
  return row;
}

export async function seedDemoIfNeeded(_sql: Sql, _adminId: number): Promise<void> {
  return;
}
