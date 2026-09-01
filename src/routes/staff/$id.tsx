import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/staff/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  return (
    <AppShell>
      <p className="text-sm text-mist">Staff #{id}</p>
      <Link to="/staff" className="mt-4 inline-block text-sm text-teal">Back to people</Link>
    </AppShell>
  );
}
