import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function requireEnv(name: string): string {
  const raw = process.env[name];
  const value = raw?.trim();
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export function createAnonServerClient(): SupabaseClient {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createServiceClient(): SupabaseClient {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}


export async function getUserFromBearer(
  authHeader: string | null
): Promise<{ id: string; email: string | null } | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const client = createAnonServerClient();
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[supabase] NEXT_PUBLIC_SITE_URL tidak di-set di production — fallback ke http://localhost:3000. Set di Vercel Env (mis. https://rebites.vercel.app) agar redirect Xendit benar.'
      );
    }
    return 'http://localhost:3000';
  }
  return raw;
}
