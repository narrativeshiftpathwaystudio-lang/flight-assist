import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export function useProfile(user: User | null) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        setIsPremium(data?.is_premium ?? false);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function upgrade() {
    if (!user) return;
    setIsPremium(true);
    await supabase.from("profiles").update({ is_premium: true }).eq("id", user.id);
  }

  async function downgrade() {
    if (!user) return;
    setIsPremium(false);
    await supabase.from("profiles").update({ is_premium: false }).eq("id", user.id);
  }

  return { isPremium, loading, upgrade, downgrade };
}
