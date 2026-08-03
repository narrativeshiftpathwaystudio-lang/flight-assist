import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { stages } from "../data/stages";
import { useAuth } from "../lib/useAuth";
import { Modal } from "./Modal";
import { AuthCard } from "./auth/AuthCard";

export function Nav() {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (user) setShowAuth(false);
  }, [user]);

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200/70 bg-cream/90 backdrop-blur-sm print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
        <NavLink to="/" className="font-serif text-xl tracking-tight text-navy-900">
          Flight Assist
        </NavLink>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 md:flex">
            {stages.map((stage) => (
              <NavLink
                key={stage.id}
                to={stage.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-navy-900 text-cream"
                      : "text-ink-soft hover:bg-sand-100 hover:text-ink"
                  }`
                }
              >
                {stage.name}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => (user ? signOut() : setShowAuth(true))}
            className="hidden text-sm font-medium text-ink-soft hover:text-ink md:block"
          >
            {user ? "Sign out" : "Sign in"}
          </button>
          <select
            className="rounded-full border border-sand-200 bg-cream px-3 py-2 text-sm text-ink md:hidden"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "__auth__") {
                setShowAuth(true);
              } else if (value === "__signout__") {
                signOut();
              } else if (value) {
                window.location.assign(value);
              }
              e.target.value = "";
            }}
            defaultValue=""
            aria-label="Navigate to stage"
          >
            <option value="" disabled>
              Menu
            </option>
            <option value="/">Home</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.path}>
                {stage.name}
              </option>
            ))}
            {user ? (
              <option value="__signout__">Sign out</option>
            ) : (
              <option value="__auth__">Sign in</option>
            )}
          </select>
        </div>
      </div>

      {showAuth && (
        <Modal onClose={() => setShowAuth(false)}>
          <AuthCard />
        </Modal>
      )}
    </header>
  );
}
