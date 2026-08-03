import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export function useProfile(user: User | null) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(currentUser: User) {
    const { data } = await supabase.from("profiles").select("is_premium").eq("id", currentUser.id).single();
    setIsPremium(data?.is_premium ?? false);
  }

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchProfile(user).then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function refresh() {
    if (!user) return;
    await fetchProfile(user);
  }

  async function startCheckout() {
    if (!user) return;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const { url } = await response.json();
    if (url) window.location.href = url;
  }

  return { isPremium, loading, refresh, startCheckout };
}
