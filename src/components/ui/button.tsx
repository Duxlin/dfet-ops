import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-teal text-paper hover:bg-teal-2",
        ink: "bg-ink text-paper hover:bg-ink-2",
        outline: "bg-cream text-ink shadow-[var(--shadow-card)] hover:bg-paper-2",
        ghost: "text-ink hover:bg-paper-2",
        danger: "bg-danger text-paper hover:bg-danger/90",
        soft: "bg-teal-soft text-teal-2 hover:bg-teal-soft/80",
      },
      size: {
        default: "h-11 rounded-lg px-4 text-sm",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-12 rounded-xl px-5 text-sm",
        icon: "size-11 rounded-lg",
        "icon-sm": "size-9 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
