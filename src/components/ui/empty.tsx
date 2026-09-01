import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid place-items-center rounded-2xl bg-cream px-6 py-14 text-center shadow-[var(--shadow-card)]", className)}>
      <div className="mb-3 grid size-12 place-items-center rounded-xl bg-teal-soft text-teal">{icon}</div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-mist">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? (
          <p className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-teal uppercase">{kicker}</p>
        ) : null}
        <h1 className="font-display text-3xl text-ink sm:text-[2rem]">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-mist">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-cream p-4 shadow-[var(--shadow-card)]">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-mist uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl tabular text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-fog">{hint}</p> : null}
    </div>
  );
}
