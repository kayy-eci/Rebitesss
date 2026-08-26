import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client untuk API routes (server-side).
 *
 * - Anon client: verifikasi Bearer token dari request header.
 * - Service client: bypass RLS untuk webhook (pakai SERVICE_ROLE_KEY).
 */

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

/**
 * Ambil user dari Bearer token. Return null kalau tidak valid.
 */
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
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    'http://localhost:3000'
  );
}
