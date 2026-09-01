import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export function SheetContent({
  className,
  children,
  side = "left",
}: {
  className?: string;
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 z-50 w-[min(20rem,88vw)] bg-ink text-paper shadow-[var(--shadow-lift)]",
          side === "left" ? "left-0" : "right-0",
          className,
        )}
      >
        <Dialog.Title className="sr-only">Menu</Dialog.Title>
        <Dialog.Close className="absolute top-3 right-3 grid size-10 place-items-center rounded-md text-paper/70 hover:bg-white/10 hover:text-paper">
          <X className="size-4" />
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
