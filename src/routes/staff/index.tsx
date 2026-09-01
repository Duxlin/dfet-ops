import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { EmploymentBadge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/empty";
import { listStaff } from "@/lib/server/fns";

export const Route = createFileRoute("/staff/")({ component: Page });

function Page() {
  const { data = [], isPending } = useQuery({
    queryKey: ["staff"],
    queryFn: () => listStaff({ data: { status: "active" } }),
  });
  return (
    <AppShell>
      <PageHeader kicker="Directory" title="People" description="Employees and interns registered with DFET." />
      {isPending ? (
        <div className="skeleton mt-6 h-48 rounded-2xl" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-cream shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-[11px] tracking-wide text-mist uppercase">
              <tr className="border-b border-line">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{s.fullName}</td>
                  <td className="px-4 py-3 text-mist">{s.role}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3"><EmploymentBadge status={s.employmentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
