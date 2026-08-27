"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Leaf, Mail } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          // Token recovery diverifikasi lewat /auth/callback lalu user
          // diarahkan ke halaman "Buat Kata Sandi Baru".
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            "/auth/buat-sandi-baru",
          )}`,
        },
      );
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Supabase env")) {
        setError(
          "Fitur ini belum aktif. Atur NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        );
      } else if (message.includes("Email not found")) {
        setError("Email tidak terdaftar.");
      } else {
        setError(message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
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

      {sent ? (
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
            Cek Email Kamu
          </h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#6B6A63]">
            Kami sudah mengirimkan tautan reset kata sandi ke{" "}
            <span className="font-semibold text-[#225138]">{email}</span>. Ikuti
            tautan tersebut untuk membuat kata sandi baru.
          </p>
          <Link
            href="/auth/login"
            className="mt-7 inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#225138] underline underline-offset-4 transition-colors hover:text-[#1B3F2C]"
          >
            Kembali ke halaman login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        <>
          <motion.h1
            variants={itemVariants}
            className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-[#225138]"
          >
            Lupa Kata
            <br />
            Sandi?
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-3 font-sans text-sm leading-relaxed text-[#6B6A63]"
          >
            Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk
            mengatur ulang kata sandimu.
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
                  htmlFor="email"
                  className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]"
                >
                  Email Address
                </label>
              </div>
              <div className="group flex items-center gap-3 border-b border-[#DEDACF] pb-2 transition-colors duration-200 focus-within:border-[#225138]">
                <Mail className="h-4 w-4 shrink-0 text-[#6B6A63]/60 transition-colors duration-200 group-focus-within:text-[#225138]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="editorial@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-1 font-sans text-[15px] text-[#1B3F2C] outline-none placeholder:text-[#6B6A63]/40"
                />
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
              {loading ? "Mengirim..." : "Kirim Tautan Reset"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-center font-sans text-sm text-[#6B6A63]"
          >
            Ingat kata sandi?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-[#225138] underline underline-offset-4 transition-colors hover:text-[#1B3F2C]"
            >
              Masuk
            </Link>
          </motion.p>
        </>
      )}
    </motion.div>
  );
}
