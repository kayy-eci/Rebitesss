"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  Lock,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

export default function BuatSandiBaruForm() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Halaman ini hanya valid lewat tautan recovery: butuh sesi dari token.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { supabase } = await import("@/lib/supabase");
      let session = false;
      for (let attempt = 0; attempt < 10 && !session; attempt += 1) {
        const {
          data: { session: current },
        } = await supabase.auth.getSession();
        session = Boolean(current);
        if (!session) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
      if (cancelled) return;
      if (!session) router.replace("/auth/login");
      else setCheckingSession(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#225138] border-t-transparent" />
        <p className="font-sans text-sm text-[#6B6A63]">
          Memverifikasi tautan reset…
        </p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="mb-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full py-1.5 pr-3 font-sans text-sm font-medium text-[#6B6A63] transition-colors duration-200 hover:text-[#225138]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Kembali
        </Link>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#225138] text-[#F7F5EF]">
          <Leaf className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <span className="font-display text-xl font-medium tracking-tight text-[#225138]">
          ReBites
        </span>
      </motion.div>

      {success ? (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center rounded-3xl border border-hairline/70 bg-white px-7 py-10 text-center shadow-[0_28px_56px_-28px_rgba(34,81,56,0.4)]"
        >
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#225138] text-[#F7F5EF]"
          >
            <CheckCircle2 className="h-7 w-7" />
          </motion.span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] text-[#225138]">
            Kata Sandi Diperbarui
          </h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#6B6A63]">
            Kata sandi barumu sudah aktif. Silakan masuk menggunakan kata sandi
            yang baru.
          </p>
          <Link
            href="/auth/login"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#225138] px-6 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F7F5EF] transition-colors duration-200 hover:bg-[#1B3F2C]"
          >
            Masuk Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        <>
          <motion.h1
            variants={itemVariants}
            className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-[#225138]"
          >
            Buat Kata
            <br />
            Sandi Baru
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-3 font-sans text-sm leading-relaxed text-[#6B6A63]"
          >
            Tautanmu terverifikasi. Tentukan kata sandi baru untuk akun
            ReBites-mu.
          </motion.p>

          <motion.form
            variants={itemVariants}
            className="mt-10 space-y-8"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <div className="mb-2.5 flex items-baseline justify-between gap-4">
                <label
                  htmlFor="new-password"
                  className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]"
                >
                  Kata Sandi Baru
                </label>
              </div>
              <div className="group flex items-center gap-3 border-b border-[#DEDACF] pb-2 transition-colors duration-200 focus-within:border-[#225138]">
                <Lock className="h-4 w-4 shrink-0 text-[#6B6A63]/60 transition-colors duration-200 group-focus-within:text-[#225138]" />
                <input
                  id="new-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-1 font-sans text-[15px] text-[#1B3F2C] outline-none placeholder:text-[#6B6A63]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  aria-pressed={showPassword}
                  className="shrink-0 rounded-sm p-0.5 text-[#6B6A63]/60 transition-colors duration-200 hover:text-[#225138] focus-visible:text-[#225138] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#225138]/40"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2.5 flex items-baseline justify-between gap-4">
                <label
                  htmlFor="confirm-new-password"
                  className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]"
                >
                  Konfirmasi Kata Sandi
                </label>
              </div>
              <div className="group flex items-center gap-3 border-b border-[#DEDACF] pb-2 transition-colors duration-200 focus-within:border-[#225138]">
                <Lock className="h-4 w-4 shrink-0 text-[#6B6A63]/60 transition-colors duration-200 group-focus-within:text-[#225138]" />
                <input
                  id="confirm-new-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent py-1 font-sans text-[15px] text-[#1B3F2C] outline-none placeholder:text-[#6B6A63]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="shrink-0 rounded-sm p-0.5 text-[#6B6A63]/60 transition-colors duration-200 hover:text-[#225138] focus-visible:text-[#225138] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#225138]/40"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="font-sans text-[13px] text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#225138] px-5 py-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F7F5EF] transition-colors duration-200 hover:bg-[#1B3F2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#225138] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>
        </>
      )}
    </motion.div>
  );
}
