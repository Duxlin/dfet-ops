import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/empty";

export const Route = createFileRoute("/assets/")({ component: Page });

function Page() {
  return (
    <AppShell>
      <PageHeader kicker="Register" title="Equipment" description="Laptops, routers, Starlink kits and phones assigned to staff or customers." />
      <p className="mt-6 text-sm text-mist">No equipment recorded yet.</p>
    </AppShell>
  );
}
