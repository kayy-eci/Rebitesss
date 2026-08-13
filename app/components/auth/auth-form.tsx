"use client";

import {
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Lock,
  Mail,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EASE: [number, number, number, number] = [
  0.22,
  1,
  0.36,
  1,
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE,
    },
  },
};

interface FieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  hint?: ReactNode;
}

function Field({
  id,
  label,
  icon: Icon,
  hint,
  className,
  ...inputProps
}: FieldProps) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <label
          htmlFor={id}
          className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]"
        >
          {label}
        </label>

        {hint}
      </div>

      <div className="group flex items-center gap-3 border-b border-[#DEDACF] pb-2 transition-colors duration-200 focus-within:border-[#3B5240]">
        <Icon className="h-4 w-4 shrink-0 text-[#6B6A63]/60 transition-colors duration-200 group-focus-within:text-[#3B5240]" />

        <input
          id={id}
          {...inputProps}
          className={`w-full bg-transparent py-1 font-sans text-[15px] text-[#2F4235] outline-none placeholder:text-[#6B6A63]/40 ${
            className ?? ""
          }`}
        />
      </div>
    </div>
  );
}

interface AuthFormProps {
  mode: "signin" | "signup";
  title: ReactNode;
  subtitle: string;
  submitLabel: string;
  redirectTo: string;
  bottomHint: {
    text: string;
    linkText: string;
    href: string;
  };
}

export default function AuthForm({
  mode,
  title,
  subtitle,
  submitLabel,
  redirectTo,
  bottomHint,
}: AuthFormProps) {
  const isSignup = mode === "signup";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // ==========================================
    // VALIDASI REGISTER
    // ==========================================

    if (isSignup && !cleanName) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!cleanEmail || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    if (isSignup && password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const { supabase } = await import(
        "@/lib/supabase"
      );

      // ==========================================
      // REGISTER
      // ==========================================

      if (isSignup) {
        const { data, error: signUpError } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: cleanName,
              },
            },
          });

        // ========================================
        // ERROR REGISTER
        // ========================================

        if (signUpError) {
          const message =
            signUpError.message.toLowerCase();

          // Email sudah terdaftar
          if (
            message.includes("already registered") ||
            message.includes("already been registered") ||
            message.includes("user already exists")
          ) {
            setError(
              "Email sudah terdaftar. Silakan masuk menggunakan akun tersebut.",
            );
            return;
          }

          // Rate limit
          if (message.includes("rate limit")) {
            setError(
              "Terlalu banyak percobaan pendaftaran. Silakan tunggu beberapa saat lalu coba lagi.",
            );
            return;
          }

          throw signUpError;
        }

        // ========================================
        // EMAIL VERIFICATION AKTIF
        // ========================================

        if (data.user && !data.session) {
          setSuccess(
            "Akun berhasil dibuat. Silakan cek email kamu dan klik link verifikasi sebelum login.",
          );

          return;
        }

        // ========================================
        // EMAIL VERIFICATION NONAKTIF
        // SESSION LANGSUNG AKTIF
        // ========================================

        if (data.session) {
          window.location.replace(redirectTo);
          return;
        }

        // ========================================
        // KONDISI TIDAK DIKENAL
        // ========================================

        setError(
          "Akun berhasil dibuat, tetapi sesi login belum tersedia.",
        );

        return;
      }

      // ==========================================
      // LOGIN
      // ==========================================

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      // ========================================
      // ERROR LOGIN
      // ========================================

      if (signInError) {
        const message =
          signInError.message.toLowerCase();

        // Email/password salah
        if (
          message.includes(
            "invalid login credentials",
          ) ||
          message.includes("invalid credentials")
        ) {
          setError("Email atau kata sandi salah.");
          return;
        }

        // Email belum diverifikasi
        if (
          message.includes("email not confirmed") ||
          message.includes("email_not_confirmed")
        ) {
          setError(
            "Email belum diverifikasi. Silakan cek email kamu terlebih dahulu.",
          );
          return;
        }

        // Rate limit
        if (message.includes("rate limit")) {
          setError(
            "Terlalu banyak percobaan login. Silakan tunggu beberapa saat lalu coba lagi.",
          );
          return;
        }

        throw signInError;
      }

      // ========================================
      // SESSION TIDAK DITEMUKAN
      // ========================================

      if (!data.session) {
        setError(
          "Login berhasil tetapi sesi tidak ditemukan. Silakan coba lagi.",
        );

        return;
      }

      // ========================================
      // LOGIN BERHASIL
      // ========================================

      window.location.replace(redirectTo);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "";

      console.error(
        "Authentication error:",
        err,
      );

      const lowerMessage =
        message.toLowerCase();

      if (
        lowerMessage.includes("supabase env")
      ) {
        setError(
          "Konfigurasi Supabase belum benar. Periksa NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
        );
      } else if (
        lowerMessage.includes("rate limit")
      ) {
        setError(
          "Terlalu banyak percobaan. Silakan tunggu beberapa saat sebelum mencoba lagi.",
        );
      } else {
        setError(
          message ||
            "Terjadi kesalahan. Silakan coba lagi.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ========================================
          TOMBOL KEMBALI
      ======================================== */}

      <motion.div
        variants={itemVariants}
        className="mb-4"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full py-1.5 pr-3 font-sans text-sm font-medium text-[#6B6A63] transition-colors duration-200 hover:text-[#3B5240]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />

          Kembali
        </Link>
      </motion.div>

      {/* ========================================
          LOGO MOBILE
      ======================================== */}

      <motion.div
        variants={itemVariants}
        className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B5240] text-[#F7F5EF]">
          <Leaf
            className="h-[18px] w-[18px]"
            strokeWidth={1.75}
          />
        </span>

        <span className="font-display text-xl font-medium tracking-tight text-[#3B5240]">
          ReBites
        </span>
      </motion.div>

      {/* ========================================
          TITLE
      ======================================== */}

      <motion.h1
        variants={itemVariants}
        className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-[#3B5240]"
      >
        {title}
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mt-3 font-sans text-sm leading-relaxed text-[#6B6A63]"
      >
        {subtitle}
      </motion.p>

      {/* ========================================
          FORM
      ======================================== */}

      <motion.form
        variants={itemVariants}
        className="mt-10 space-y-8"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Nama hanya muncul saat register */}

        {isSignup && (
          <Field
            id="fullName"
            label="Nama Lengkap"
            icon={User}
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Nama Lengkap"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
          />
        )}

        {/* Email */}

        <Field
          id="email"
          label="Email Address"
          icon={Mail}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="editorial@example.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* Password */}

        <Field
          id="password"
          label="Password"
          icon={Lock}
          name="password"
          type="password"
          autoComplete={
            isSignup
              ? "new-password"
              : "current-password"
          }
          placeholder="••••••••"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          hint={
            !isSignup ? (
              <Link
                href="/forgot-password"
                className="font-sans text-xs text-[#6B6A63] underline underline-offset-4 transition-colors hover:text-[#3B5240]"
              >
                Forgot Password?
              </Link>
            ) : undefined
          }
        />

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-[13px] leading-relaxed text-red-600"
          >
            {error}
          </div>
        )}

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {success && (
          <div
            role="status"
            className="rounded-md border border-green-200 bg-green-50 px-4 py-3 font-sans text-[13px] leading-relaxed text-[#3B5240]"
          >
            {success}
          </div>
        )}

        {/* ======================================
            SUBMIT BUTTON
        ====================================== */}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#3B5240] px-5 py-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F7F5EF] transition-colors duration-200 hover:bg-[#2F4235] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B5240] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? isSignup
              ? "Mendaftar..."
              : "Masuk..."
            : submitLabel}

          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.form>

      {/* ========================================
          BOTTOM HINT
      ======================================== */}

      <motion.p
        variants={itemVariants}
        className="mt-8 text-center font-sans text-sm text-[#6B6A63]"
      >
        {bottomHint.text}{" "}

        <Link
          href={bottomHint.href}
          className="font-semibold text-[#3B5240] underline underline-offset-4 transition-colors hover:text-[#2F4235]"
        >
          {bottomHint.linkText}
        </Link>
      </motion.p>
    </motion.div>
  );
}