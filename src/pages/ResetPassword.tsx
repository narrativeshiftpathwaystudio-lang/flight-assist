import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

export function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16 lg:px-10">
      <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">Reset password</span>
        <h1 className="mt-2 font-serif text-2xl text-navy-900">Choose a new password</h1>

        {done ? (
          <>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
              Your password has been updated.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-navy-800"
            >
              Continue
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <input
              type="password"
              required
              minLength={6}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-sand-200 px-3 py-2 text-sm text-ink focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-lg border border-sand-200 px-3 py-2 text-sm text-ink focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
            />

            {error && <p className="text-sm text-clay-700">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {submitting ? "Please wait…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
