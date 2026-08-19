'use client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: any;

if (supabaseUrl && supabaseAnonKey) {
  const { createClient } = require('@supabase/supabase-js');
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else {
  console.warn(
    '[ReBites] Supabase env vars tidak ditemukan. Menggunakan mock client untuk development.'
  );
  const { supabase: mockClient } = require('./supabase-mock');
  supabaseClient = mockClient;
}

export const supabase = supabaseClient;
