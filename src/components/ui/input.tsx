import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      suppressHydrationWarning
      className={cn(
        "flex h-11 w-full rounded-lg bg-cream px-3 text-sm text-ink shadow-[var(--shadow-card)] placeholder:text-fog",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-lg bg-cream px-3 py-2.5 text-sm text-ink shadow-[var(--shadow-card)] placeholder:text-fog",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-lg bg-cream px-3 text-sm text-ink shadow-[var(--shadow-card)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-ink", className)} {...props} />;
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
