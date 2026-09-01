import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/empty";

export const Route = createFileRoute("/tasks/")({ component: Page });

function Page() {
  return (
    <AppShell>
      <PageHeader kicker="Work" title="Tasks" description="Assign and track work. Create staff first, then add tasks from here." />
      <p className="mt-6 text-sm text-mist">No tasks yet. Use People to add staff, then come back to assign work.</p>
    </AppShell>
  );
}
