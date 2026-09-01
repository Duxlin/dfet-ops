import { createFileRoute, Navigate } from "@tanstack/react-router";
import { LoginScreen } from "@/components/auth/login-screen";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { prepareWorkspace } from "@/lib/server/fns";

export const Route = createFileRoute("/login")({
  loader: () => prepareWorkspace(),
  component: Login,
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) return <Navigate to="/" />;
  return <LoginScreen />;
}
