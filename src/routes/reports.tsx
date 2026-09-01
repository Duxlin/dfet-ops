import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/empty";

export const Route = createFileRoute("/reports")({ component: Page });

function Page() {
  return (
    <AppShell>
      <PageHeader kicker="Activity" title="Reports" description="Daily and weekly activity reports from the team." />
      <p className="mt-6 text-sm text-mist">No reports submitted yet.</p>
    </AppShell>
  );
}
