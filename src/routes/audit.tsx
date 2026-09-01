import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, PageHeader } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/format";
import { usePerm } from "@/lib/me";
import { listAudit } from "@/lib/server/fns";

export const Route = createFileRoute("/audit")({ component: Page });

function Page() {
  return (
    <AppShell>
      <Audit />
    </AppShell>
  );
}

function Audit() {
  const perm = usePerm();
  const [q, setQ] = useState("");
  const { data = [], isPending } = useQuery({
    queryKey: ["audit", q],
    queryFn: () => listAudit({ data: { q } }),
    enabled: perm.viewAudit,
  });

  if (!perm.viewAudit) {
    return <p className="text-sm text-mist">Audit logs are limited to administrators.</p>;
  }

  return (
    <div className="grid gap-6">
      <PageHeader kicker="Security" title="Audit log" description="Who created, assigned, approved or deactivated records." />
      <Input placeholder="Search actions" value={q} onChange={(e) => setQ(e.target.value)} />
      {isPending ? (
        <div className="skeleton h-48 rounded-2xl" />
      ) : data.length === 0 ? (
        <EmptyState icon={<Shield className="size-5" />} title="No matching events" body="Activity will appear as the team uses the desk." />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-cream shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[11px] tracking-wide text-mist uppercase">
              <tr className="border-b border-line">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-mist">{formatDateTime(a.createdAt)}</td>
                  <td className="px-4 py-3">{a.staffName || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a.action}</td>
                  <td className="px-4 py-3 text-mist">
                    {a.entityType}
                    {a.entityId ? ` #${a.entityId}` : ""}
                    {a.detail ? ` · ${a.detail}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
