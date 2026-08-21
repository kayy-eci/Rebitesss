"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, LogOut, Package } from "lucide-react";

export default function DashboardPenjualPage() {
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  const [umkm, setUmkm] = useState<{ business_name: string; category: string; city: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/auth/login";
        return;
      }
      setUser({
        email: session.user.email,
        fullName: session.user.user_metadata?.full_name || session.user.email,
      });

      const { data } = await supabase
        .from("umkm_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      if (data) {
        setUmkm({
          business_name: data.business_name,
          category: data.category,
          city: data.city,
        });
      }
    })();
  }, []);

  async function handleLogout() {
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#225138] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <header className="border-b border-[#DEDACF] bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-5 w-5 text-[#225138]" />
            <span className="font-display text-lg font-semibold text-[#225138]">
              ReBites
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md px-3 py-2 font-sans text-sm text-[#6B6A63] transition-colors hover:bg-[#DEDACF]/30 hover:text-[#225138]"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-2xl font-semibold text-[#225138]">
          Dashboard Penjual
        </h1>
        <p className="mt-2 font-sans text-sm text-[#6B6A63]">
          Selamat datang, {user.fullName}
        </p>

        {umkm && (
          <div className="mt-8 rounded-lg border border-[#DEDACF] bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#225138]/10">
                <Store className="h-5 w-5 text-[#225138]" />
              </div>
              <div>
                <h2 className="font-sans text-lg font-semibold text-[#1B3F2C]">
                  {umkm.business_name}
                </h2>
                <p className="font-sans text-sm text-[#6B6A63]">
                  {umkm.category} &middot; {umkm.city}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-md bg-[#F7F5EF] p-4">
              <Package className="h-5 w-5 text-[#6B6A63]/60" />
              <p className="font-sans text-sm text-[#6B6A63]">
                Belum ada produk. Mulai tambahkan produk pertama Anda.
              </p>
            </div>
          </div>
        )}

        {!umkm && (
          <div className="mt-8 rounded-lg border border-[#DEDACF] bg-white p-6 text-center">
            <Store className="mx-auto h-10 w-10 text-[#6B6A63]/40" />
            <p className="mt-3 font-sans text-sm text-[#6B6A63]">
              Sedang memuat data usaha...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
