"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  User,
  Mail,
  LogOut,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        // Jika terjadi error atau user belum login
        if (error || !user) {
          router.replace("/login");
          return;
        }

        // Ambil data user dari Supabase Auth
        setProfile({
          id: user.id,
          email: user.email || "",
          fullName:
            user.user_metadata?.full_name || "Pengguna",
        });
      } catch (error) {
        console.error("Profile error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        setLoggingOut(false);
        return;
      }

      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <Loader2 className="h-6 w-6 animate-spin text-[#3B5240]" />
      </main>
    );
  }

  // =========================
  // USER TIDAK DITEMUKAN
  // =========================

  if (!profile) {
    return null;
  }

  // =========================
  // PROFILE PAGE
  // =========================

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-5 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Kembali */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 text-sm text-[#6B6A63] transition-colors hover:text-[#3B5240]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Home
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6A63]">
            Account
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-[#3B5240]">
            Profil Saya
          </h1>

          <p className="mt-2 text-sm text-[#6B6A63]">
            Kelola informasi akun ReBites kamu.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-[#DEDACF] bg-white p-6 shadow-sm">

          {/* Avatar + Nama */}
          <div className="mb-8 flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3B5240] text-[#F7F5EF]">
              <User className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#2F4235]">
                {profile.fullName}
              </h2>

              <p className="text-sm text-[#6B6A63]">
                Pembeli ReBites
              </p>
            </div>

          </div>

          {/* Nama Lengkap */}
          <div className="mb-5 border-b border-[#E8E5DC] pb-5">

            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B6A63]">
              <User className="h-4 w-4" />
              Nama Lengkap
            </div>

            <p className="text-[15px] text-[#2F4235]">
              {profile.fullName}
            </p>

          </div>

          {/* Email */}
          <div className="mb-8">

            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B6A63]">
              <Mail className="h-4 w-4" />
              Email
            </div>

            <p className="break-all text-[15px] text-[#2F4235]">
              {profile.email}
            </p>

          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B5240] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F4235] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Keluar...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            )}
          </button>

        </div>
      </div>
    </main>
  );
}