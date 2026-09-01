import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Department, Me } from "@/lib/types";
import { requireActor, resolveMe } from "./authz";
import { ensureDemoAdmin } from "./demo-admin";

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
