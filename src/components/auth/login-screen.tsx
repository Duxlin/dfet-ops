import { useState, type FormEvent } from "react";
import { DfetMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { DEMO_LOGIN, DEMO_PASSWORD, normalizeLogin } from "@/lib/demo-login";

export function LoginScreen() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(DEMO_LOGIN);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onOauth(id: string) {
    setError(null);
    setBusy(id);
    try {
      await signIn(id, { callbackURL: "/", errorCallbackURL: "/login" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
      setBusy(null);
    }
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy("email");
    try {
      const loginEmail = normalizeLogin(email);
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email: loginEmail,
          password,
          name: name || loginEmail.split("@")[0]!,
        });
        if (res.error) throw new Error(res.error.message || "Could not create account.");
      } else {
        const res = await authClient.signIn.email({ email: loginEmail, password });
        if (res.error) throw new Error(res.error.message || "Could not sign in.");
      }
      await authClient.getSession();
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(null);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-paper lg:grid lg:grid-cols-2">
      <section className="ink-panel mark-grid relative flex flex-none flex-col gap-4 p-6 lg:h-full lg:justify-between lg:gap-0 lg:p-10">
        <div className="flex items-center gap-3">
          <DfetMark className="size-9 lg:size-10" light />
          <span className="font-display text-xl tracking-tight text-paper lg:text-2xl">DFET Ops</span>
        </div>
        <div className="max-w-md lg:py-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-teal-soft uppercase">Internal desk</p>
          <h1 className="mt-2 font-display text-2xl leading-[1.1] text-balance text-paper lg:mt-3 lg:text-5xl lg:leading-[1.08]">
            Staff, tasks and kits — in one quiet place.
          </h1>
          <p className="mt-3 hidden text-sm leading-relaxed text-paper/70 lg:mt-5 lg:block">
            Built for DFET field and office teams. Assign work, track Starlink kits and routers, and read daily
            reports without chasing WhatsApp threads.
          </p>
        </div>
        <p className="hidden text-xs text-paper/40 lg:block">DFET · Asset & staff operations</p>
      </section>

      <section className="grid place-items-center bg-paper px-5 py-8 lg:py-12">
        <div className="w-full max-w-sm">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-teal uppercase">Sign in</p>
          <h2 className="mt-1 font-display text-3xl text-ink">Welcome back</h2>
          <p className="mt-2 text-sm text-mist">
            Super Admin is <span className="font-medium text-ink">{DEMO_LOGIN}</span> /{" "}
            <span className="font-medium text-ink">{DEMO_PASSWORD}</span>. Change this later when DFET picks a
            real account.
          </p>

          {authEnabled ? (
            <div className="mt-8 grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  variant="outline"
                  className="w-full"
                  disabled={busy !== null}
                  onClick={() => void onOauth(p.providerId)}
                >
                  {busy === p.providerId ? "Opening…" : `Continue with ${p.label}`}
                </Button>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-mist">Sign-in is disabled.</p>
          )}

          <div className="my-6 flex items-center gap-3 text-[11px] tracking-wide text-fog uppercase">
            <span className="h-px flex-1 bg-line" />
            or email
            <span className="h-px flex-1 bg-line" />
          </div>

          <form className="grid gap-3" onSubmit={(e) => void onEmail(e)}>
            {mode === "up" ? (
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            ) : null}
            <Input
              type="text"
              placeholder="Username or work email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={5}
              required
            />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy !== null}>
              {busy === "email" ? "Please wait…" : mode === "up" ? "Create account" : "Sign in with email"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-sm text-mist hover:text-ink"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setError(null);
            }}
          >
            {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
    </main>
  );
}
