import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { LoginScreen } from "@/components/auth/login-screen";
import { AppShell } from "@/components/layout/app-shell";
import { PriorityBadge, ReportStatusBadge, TaskStatusBadge } from "@/components/ui/badge";
import { PageHeader, StatCard } from "@/components/ui/empty";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatDate, formatDateTime } from "@/lib/format";
import { useMe } from "@/lib/me";
import { getDashboard, prepareWorkspace } from "@/lib/server/fns";

export const Route = createFileRoute("/")({
  loader: () => prepareWorkspace(),
  component: Home,
});

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) return <LoginScreen />;
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}

function Dashboard() {
  const me = useMe();
  const { data, isPending } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
  });

  if (isPending || !data) {
    return (
      <div className="grid gap-4">
        <div className="skeleton h-16 w-72 rounded-lg" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      </div>
    );
  }

  const s = data.stats;
  const pie = [
    { name: "Pending", value: s.pendingTasks, color: "#8A948F" },
    { name: "In progress", value: s.tasksInProgress, color: "#2C4A6E" },
    { name: "Overdue", value: s.overdueTasks, color: "#9B3A32" },
    { name: "Completed", value: s.tasksCompleted, color: "#2D6A4F" },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid gap-8">
      <PageHeader
        kicker="Overview"
        title={`Good day, ${me.staff?.fullName.split(" ")[0]}`}
        description={
          me.permissions.viewAnalytics
            ? "Live picture of people, work and equipment across DFET."
            : "Your assignments, reports and the kit on the books."
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Employees" value={s.totalEmployees} />
        <StatCard label="Interns" value={s.totalInterns} />
        <StatCard label="Tasks assigned" value={s.tasksAssigned} />
        <StatCard label="Completed" value={s.tasksCompleted} />
        <StatCard label="In progress" value={s.tasksInProgress} />
        <StatCard label="Overdue" value={s.overdueTasks} hint="Past deadline" />
        <StatCard label="Pending approval" value={s.reportsPendingApproval} />
        <StatCard label="Kits assigned" value={s.assetsAssigned} hint={`${s.assetsAvailable} available`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-cream p-5 shadow-[var(--shadow-card)] lg:col-span-1">
          <h2 className="font-display text-lg">Task mix</h2>
          <p className="text-sm text-mist">All work currently on the books</p>
          <div className="mt-2 h-48">
            {pie.length === 0 ? (
              <p className="grid h-full place-items-center text-sm text-mist">No tasks yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="none">
                    {pie.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <ul className="mt-2 grid gap-1.5 text-sm">
            {pie.map((d) => (
              <li key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-mist">
                  <i className="size-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="tabular text-ink">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-cream p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Needs attention</h2>
            <Link to="/tasks" className="text-sm text-teal hover:underline">
              All tasks
            </Link>
          </div>
          {data.overdue.length === 0 ? (
            <p className="mt-8 text-sm text-mist">No overdue work. Keep it that way.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {data.overdue.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link to="/tasks/$id" params={{ id: String(t.id) }} className="font-medium hover:underline">
                      {t.title}
                    </Link>
                    <p className="text-xs text-mist">Due {formatDateTime(t.deadline)}</p>
                  </div>
                  <PriorityBadge priority={t.priority} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-cream p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Recent tasks</h2>
            <Link to="/tasks" className="text-sm text-teal hover:underline">
              View
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {data.recentTasks.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link to="/tasks/$id" params={{ id: String(t.id) }} className="truncate font-medium hover:underline">
                    {t.title}
                  </Link>
                  <p className="truncate text-xs text-mist">
                    {t.assignees.map((a) => a.fullName).join(", ") || "Unassigned"}
                  </p>
                </div>
                <TaskStatusBadge status={t.status} />
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-cream p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Latest reports</h2>
            <Link to="/reports" className="text-sm text-teal hover:underline">
              View
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {data.recentReports.length === 0 ? (
              <li className="py-6 text-sm text-mist">No reports submitted yet.</li>
            ) : (
              data.recentReports.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">{r.staffName}</p>
                    <p className="text-xs text-mist">
                      {r.period} · {formatDate(r.reportDate)}
                    </p>
                  </div>
                  <ReportStatusBadge status={r.status} />
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
