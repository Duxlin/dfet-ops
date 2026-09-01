import { cn } from "@/lib/cn";

export function DfetMark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={light ? "#F4F1EA" : "#1C2421"} />
      <polygon points="16,2 30,16 16,30 2,16" fill="#0E6B5C" />
      <polygon points="16,10 22,16 16,22 10,16" fill={light ? "#1C2421" : "#F4F1EA"} />
    </svg>
  );
}

export function DfetWordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <DfetMark className="size-8" light={inverted} />
      <div className="leading-tight">
        <div className={cn("font-display text-[1.15rem] tracking-tight", inverted ? "text-paper" : "text-ink")}>
          DFET Ops
        </div>
        <div className={cn("text-[10px] font-medium tracking-[0.16em] uppercase", inverted ? "text-paper/55" : "text-mist")}>
          Asset & task desk
        </div>
      </div>
    </div>
  );
}
