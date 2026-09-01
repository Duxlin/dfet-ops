import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { AssetStatus, EmploymentStatus, ReportStatus, TaskPriority, TaskStatus } from "@/lib/types";

type Tone = "neutral" | "teal" | "ok" | "warn" | "danger" | "info";

export function Badge({ className, tone = "neutral", children }: { className?: string; tone?: Tone; children: ReactNode }) {
  const tones: Record<Tone, string> = {
    neutral: "bg-paper-2 text-mist",
    teal: "bg-teal-soft text-teal-2",
    ok: "bg-teal-soft text-ok",
    warn: "bg-warn-soft text-warn",
    danger: "bg-danger-soft text-danger",
    info: "bg-info-soft text-info",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { tone: Tone; label: string }> = {
    pending: { tone: "neutral", label: "Pending" },
    in_progress: { tone: "info", label: "In progress" },
    completed: { tone: "ok", label: "Completed" },
    overdue: { tone: "danger", label: "Overdue" },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const map: Record<TaskPriority, { tone: Tone; label: string }> = {
    low: { tone: "neutral", label: "Low" },
    medium: { tone: "info", label: "Medium" },
    high: { tone: "warn", label: "High" },
    critical: { tone: "danger", label: "Critical" },
  };
  const m = map[priority];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const map: Record<AssetStatus, { tone: Tone; label: string }> = {
    available: { tone: "ok", label: "Available" },
    assigned: { tone: "teal", label: "Assigned" },
    maintenance: { tone: "warn", label: "Maintenance" },
    damaged: { tone: "danger", label: "Damaged" },
    lost: { tone: "danger", label: "Lost" },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const map: Record<ReportStatus, { tone: Tone; label: string }> = {
    submitted: { tone: "warn", label: "Pending approval" },
    approved: { tone: "ok", label: "Approved" },
    rejected: { tone: "danger", label: "Returned" },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function EmploymentBadge({ status }: { status: EmploymentStatus }) {
  const map: Record<EmploymentStatus, { tone: Tone; label: string }> = {
    active: { tone: "ok", label: "Active" },
    inactive: { tone: "neutral", label: "Inactive" },
    on_leave: { tone: "warn", label: "On leave" },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
