import { hashPassword } from "better-auth/crypto";
import { DEMO_EMAIL, DEMO_NAME, DEMO_PASSWORD } from "@/lib/demo-login";
import { getSql } from "@/lib/db";
import { bootstrapFirstAdmin, seedDemoIfNeeded } from "./authz";

let boot: Promise<void> | null = null;

export function ensureDemoAdmin(): Promise<void> {
  boot ??= seedDemoAdmin().catch((err) => {
    boot = null;
    throw err;
  });
  return boot;
}

async function seedDemoAdmin(): Promise<void> {
  const sql = await getSql();
  const existing = await sql.query<{ id: string }>(
    `select id from "user" where lower(email) = lower($1) limit 1`,
    [DEMO_EMAIL],
  );
  let userId = existing[0]?.id;
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  if (!userId) {
    userId = crypto.randomUUID();
    await sql.query(
      `insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
       values ($1, $2, $3, true, now(), now())`,
      [userId, DEMO_NAME, DEMO_EMAIL],
    );
    await sql.query(
      `insert into "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       values ($1, $2, 'credential', $3, $4, now(), now())`,
      [crypto.randomUUID(), userId, userId, passwordHash],
    );
  } else {
    const accounts = await sql.query<{ id: string }>(
      `select id from "account" where "userId" = $1 and "providerId" = 'credential' limit 1`,
      [userId],
    );
    if (accounts[0]) {
      await sql.query(`update "account" set password = $1, "updatedAt" = now() where id = $2`, [
        passwordHash,
        accounts[0].id,
      ]);
    } else {
      await sql.query(
        `insert into "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
         values ($1, $2, 'credential', $3, $4, now(), now())`,
        [crypto.randomUUID(), userId, userId, passwordHash],
      );
    }
    await sql.query(`update "user" set name = $1, "updatedAt" = now() where id = $2`, [DEMO_NAME, userId]);
  }

  const staff = await sql.query<{ id: number }>(
    `select id from staff where user_id = $1 or lower(email) = lower($2) limit 1`,
    [userId, DEMO_EMAIL],
  );
  if (staff[0]) {
    await sql.query(
      `update staff
         set user_id = $1, email = $2, full_name = $3, role = 'super_admin',
             employment_status = 'active', updated_at = now()
       where id = $4`,
      [userId, DEMO_EMAIL, DEMO_NAME, staff[0].id],
    );
    await seedDemoIfNeeded(sql, staff[0].id);
    return;
  }

  await bootstrapFirstAdmin(sql, userId, DEMO_NAME, DEMO_EMAIL, null);
}
