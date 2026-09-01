/** Temporary Super Admin credentials — replace when DFET picks a real account. */
export const DEMO_LOGIN = "admin";
export const DEMO_EMAIL = "admin@dfet.ng";
export const DEMO_PASSWORD = "admin";
export const DEMO_NAME = "Admin";

export function normalizeLogin(value: string): string {
  const v = value.trim();
  if (!v) return v;
  return v.includes("@") ? v : `${v}@dfet.ng`;
}
