import { useState } from "react";
import { useAuth } from "../../lib/useAuth";

type Mode = "sign-in" | "sign-up";

export function AuthCard() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    if (mode === "sign-up") {
      const { data, error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        setMessage("Check your email for a confirmation link, then sign in.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    }
    setSubmitting(false);
  }

  function toggleMode() {
    setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"));
    setError(null);
    setMessage(null);
  }

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">
        {mode === "sign-in" ? "Sign in" : "Create an account"}
      </span>
      <h2 className="mt-2 font-serif text-2xl text-navy-900">
        {mode === "sign-in" ? "Welcome back" : "Save your plan to your account"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        {mode === "sign-in"
          ? "Sign in to manage your plan."
          : "An account keeps your premium plan tied to you — not just this browser."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-sand-200 px-3 py-2 text-sm text-ink focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-sand-200 px-3 py-2 text-sm text-ink focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
        />

        {error && <p className="text-sm text-clay-700">{error}</p>}
        {message && <p className="text-sm text-forest-700">{message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-navy-800 disabled:opacity-60"
        >
          {submitting ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={toggleMode}
        className="mt-4 text-sm font-medium text-ink-soft underline decoration-sand-300 underline-offset-4 hover:text-ink"
      >
        {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
