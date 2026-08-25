'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export const DEMO_USER_ID = 'demo-user';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
}

export function mapSupabaseUser(raw: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): CurrentUser {
  return {
    id: raw.id,
    fullName:
      (raw.user_metadata?.full_name as string | undefined)?.trim() ||
      raw.email?.split('@')[0] ||
      'Pengguna ReBites',
    email: raw.email ?? '',
  };
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const { data } = await supabase.auth.getSession();
  const raw = data.session?.user;
  return raw ? mapSupabaseUser(raw) : null;
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await fetchCurrentUser();
  return user?.id ?? null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchCurrentUser().then((result) => {
      if (!mounted) return;
      setUser(result);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const raw = session?.user;
      setUser(raw ? mapSupabaseUser(raw) : null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, userId: user?.id ?? null, loading };
}
