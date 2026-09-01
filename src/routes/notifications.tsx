import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/empty";
import { formatRelative } from "@/lib/format";
import { useInvalidate } from "@/lib/me";
import { listNotifications, markNotificationsRead } from "@/lib/server/fns";

export const Route = createFileRoute("/notifications")({ component: Page });

function Page() {
  return (
    <AppShell>
      <Notes />
    </AppShell>
  );
}

function Notes() {
  const invalidate = useInvalidate();
  const { data = [], isPending } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
  });
  const mark = useMutation({
    mutationFn: () => markNotificationsRead({ data: {} }),
    onSuccess: () => invalidate("notifications", "me", "dashboard"),
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        kicker="Inbox"
        title="Notifications"
        description="Task assignments, overdue work, kit moves and report decisions."
        actions={
          <Button variant="outline" onClick={() => mark.mutate()} disabled={mark.isPending}>
            Mark all read
          </Button>
        }
      />
      {isPending ? (
        <div className="skeleton h-48 rounded-2xl" />
      ) : data.length === 0 ? (
        <EmptyState icon={<Bell className="size-5" />} title="You're up to date" body="New assignments and overdue alerts will land here." />
      ) : (
        <ul className="overflow-hidden rounded-2xl bg-cream shadow-[var(--shadow-card)] divide-y divide-line">
          {data.map((n) => {
            const href =
              n.entityType === "task" && n.entityId
                ? `/tasks/${n.entityId}`
                : n.entityType === "asset" && n.entityId
                  ? `/assets/${n.entityId}`
                  : n.entityType === "report"
                    ? "/reports"
                    : undefined;
            const inner = (
              <div className={`px-4 py-3 ${n.readAt ? "opacity-60" : ""}`}>
                <p className="font-medium">{n.title}</p>
                {n.body ? <p className="text-sm text-mist">{n.body}</p> : null}
                <p className="mt-1 text-xs text-fog">{formatRelative(n.createdAt)}</p>
              </div>
            );
            return (
              <li key={n.id}>
                {href ? (
                  <a href={href} className="block hover:bg-paper/80">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
