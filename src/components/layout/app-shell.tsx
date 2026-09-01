import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ScrollText,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { DfetWordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";
import { MeProvider, useMeQuery } from "@/lib/me";
import { ROLE_LABELS } from "@/lib/roles";
import type { Me } from "@/lib/types";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, key: "dash" },
  { to: "/tasks", label: "Tasks", icon: ClipboardList, key: "tasks" },
  { to: "/staff", label: "People", icon: Users, key: "staff" },
  { to: "/assets", label: "Equipment", icon: Package, key: "assets" },
  { to: "/reports", label: "Reports", icon: ScrollText, key: "reports" },
] as const;

function NavLinks({ me, onNavigate }: { me: Me; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    ...NAV,
    ...(me.permissions.viewAudit ? [{ to: "/audit", label: "Audit log", icon: Shield, key: "audit" }] : []),
  ];
  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
              active ? "bg-white/10 text-paper" : "text-paper/65 hover:bg-white/5 hover:text-paper",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    return <img src={src} alt="" className="size-9 rounded-full object-cover outline outline-1 -outline-offset-1 outline-white/20" />;
  }
  return (
    <span className="grid size-9 place-items-center rounded-full bg-teal text-[11px] font-semibold text-paper">
      {initials(name)}
    </span>
  );
}

function Side({ me, onNavigate }: { me: Me; onNavigate?: () => void }) {
  const staff = me.staff!;
  const [out, setOut] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-5 pb-6">
        <DfetWordmark inverted />
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <NavLinks me={me} onNavigate={onNavigate} />
      </div>
      <div className="mt-auto border-t border-white/10 p-3">
        <Link to="/profile" onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5">
          <Avatar name={staff.fullName} src={staff.profilePicture} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-paper">{staff.fullName}</p>
            <p className="truncate text-[11px] text-paper/50">{ROLE_LABELS[staff.role]}</p>
          </div>
        </Link>
        <button
          type="button"
          disabled={out}
          onClick={() => {
            setOut(true);
            void signOut("/login").catch(() => {
              setOut(false);
              toast.error("Could not sign out. Try again.");
            });
          }}
          className="mt-1 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-paper/60 hover:bg-white/5 hover:text-paper"
        >
          <LogOut className="size-4" />
          {out ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}

function PendingAccess() {
  const { user } = useCurrentUserState();
  const [out, setOut] = useState(false);
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5">
      <div className="w-full max-w-md rounded-3xl bg-cream p-8 shadow-[var(--shadow-card)]">
        <DfetWordmark />
        <h1 className="mt-8 font-display text-2xl text-ink">Access pending</h1>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          You&apos;re signed in{user?.primaryEmail ? ` as ${user.primaryEmail}` : ""}, but no staff record is linked
          to this account yet. Ask an administrator or HR to add you using that email.
        </p>
        <Button className="mt-6" variant="outline" disabled={out} onClick={() => { setOut(true); void signOut("/login").catch(() => setOut(false)); }}>
          {out ? "Signing out…" : "Use a different account"}
        </Button>
      </div>
    </div>
  );
}

function pageTitle(pathname: string): string {
  if (pathname.startsWith("/tasks")) return "Tasks";
  if (pathname.startsWith("/staff")) return "People";
  if (pathname.startsWith("/assets")) return "Equipment";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/notifications")) return "Notifications";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/audit")) return "Audit";
  return "Overview";
}

function ShellFrame({ me, children }: { me: Me; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = me.unreadNotifications;
  return (
    <div className="min-h-dvh bg-paper">
      <aside className="ink-panel mark-grid fixed inset-y-0 left-0 hidden w-60 lg:flex lg:flex-col">
        <Side me={me} />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <Side me={me} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-paper/85 px-4 backdrop-blur-md lg:h-16 lg:px-8">
          <button type="button" className="grid size-11 place-items-center rounded-lg text-ink lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-sm text-mist">
            {me.staff?.departmentName ?? "DFET"}
            <span className="mx-2 text-line">/</span>
            <span className="text-ink">{pageTitle(pathname)}</span>
          </p>
          <Link to="/notifications" className="relative grid size-11 place-items-center rounded-lg text-ink hover:bg-paper-2" aria-label="Notifications">
            <Bell className="size-5" />
            {unread > 0 ? (
              <span className="absolute top-2 right-2 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-paper">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </Link>
          <Link to="/profile" className="hidden size-11 place-items-center rounded-lg text-ink hover:bg-paper-2 sm:grid" aria-label="Profile">
            <UserRound className="size-5" />
          </Link>
        </header>
        <main className="px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-12">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-cream/95 px-1 py-1 backdrop-blur-md lg:hidden">
        {NAV.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.key} to={item.to} className={cn("flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium", active ? "text-teal" : "text-mist")}>
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 flex w-60 flex-col bg-ink p-5">
          <p className="font-display text-lg text-paper">DFET Ops</p>
          <p className="mt-1 text-xs text-paper/50">Loading your desk</p>
        </div>
      </div>
      <div className="lg:pl-60">
        <div className="flex h-14 items-center border-b border-line px-4 lg:h-16 lg:px-8">
          <p className="text-sm text-mist">DFET Ops · loading</p>
        </div>
        <div className="grid gap-4 p-6 lg:p-8">
          <h1 className="font-display text-2xl text-ink">Preparing your workspace</h1>
          <div className="skeleton h-10 w-48 rounded-lg" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const meQuery = useMeQuery(!!user && !isPending);
  if (isPending) return <ShellSkeleton />;
  if (!user) return <RedirectToSignIn />;
  if (meQuery.isPending) return <ShellSkeleton />;
  if (meQuery.isError) {
    const msg = meQuery.error instanceof Error ? meQuery.error.message : "Could not load your profile.";
    if (msg === "Unauthorized") return <RedirectToSignIn />;
    return (
      <div className="grid min-h-dvh place-items-center bg-paper p-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl">Couldn&apos;t open DFET Ops</h1>
          <p className="mt-2 text-sm text-mist">{msg}</p>
        </div>
      </div>
    );
  }
  const me = meQuery.data!;
  if (me.pending || !me.staff) return <PendingAccess />;
  return (
    <MeProvider value={me}>
      <ShellFrame me={me}>{children}</ShellFrame>
    </MeProvider>
  );
}
