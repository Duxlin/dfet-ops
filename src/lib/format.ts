import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

export function isoOrNull(value: unknown): string | null {
  if (value == null || value === "") return null;
  const s = iso(value);
  return s || null;
}

export function asNum(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") return Number(value);
  return 0;
}

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = value.includes("T") ? parseISO(value) : parseISO(value.slice(0, 10));
  return isValid(d) ? d : null;
}

export function formatDate(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return "—";
  return format(d, "d MMM yyyy");
}

export function formatDateTime(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return "—";
  return format(d, "d MMM yyyy, HH:mm");
}

export function formatRelative(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return "";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function todayISODate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function downloadTextFile(filename: string, contents: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function toCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>): string {
  const esc = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return "\uFEFF" + [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
