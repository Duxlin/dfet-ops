import { Navigate } from "@tanstack/react-router";

export const SIGN_IN_PATH = "/login";

export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) {
  return <Navigate to={to} />;
}
