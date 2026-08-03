import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  function signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
  }

  function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  function signOut() {
    return supabase.auth.signOut();
  }

  function resetPasswordForEmail(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  function updatePassword(password: string) {
    return supabase.auth.updateUser({ password });
  }

  return { user, loading, signUp, signIn, signOut, resetPasswordForEmail, updatePassword };
}
