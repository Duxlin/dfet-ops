import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/assets/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  return (
    <AppShell>
      <p className="text-sm text-mist">Asset #{id}</p>
      <Link to="/assets" className="mt-4 inline-block text-sm text-teal">Back to equipment</Link>
    </AppShell>
  );
}
