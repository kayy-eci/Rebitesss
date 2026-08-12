import type { UserRole } from "@/types";

export type AuthRoleChoice = "admin" | "penjual" | "pembeli";

export function normalizeRole(role?: string | null): AuthRoleChoice | null {
  switch (role) {
    case "admin":
      return "admin";
    case "umkm":
    case "penjual":
      return "penjual";
    case "buyer":
    case "pembeli":
      return "pembeli";
    default:
      return null;
  }
}

export function getDashboardPath(role?: string | null): string {
  const normalized = normalizeRole(role);

  switch (normalized) {
    case "admin":
      return "/admin";
    case "penjual":
      return "/penjual";
    case "pembeli":
      return "/pembeli";
    default:
      return "/login";
  }
}

export function getDatabaseRole(role: AuthRoleChoice): UserRole {
  switch (role) {
    case "admin":
      return "admin";
    case "penjual":
      return "umkm";
    case "pembeli":
      return "buyer";
  }
}

export function getAuthErrorMessage(
  errorMessage?: string | null,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
) {
  if (!errorMessage) {
    return fallback;
  }

  const message = errorMessage.toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return "Email atau password salah.";
  }

  if (
    message.includes("user already registered") ||
    message.includes("already registered")
  ) {
    return "Email sudah terdaftar. Silakan login atau gunakan email lain.";
  }

  if (message.includes("password")) {
    return "Password terlalu lemah atau tidak memenuhi aturan keamanan.";
  }

  if (message.includes("email") && message.includes("confirm")) {
    return "Silakan konfirmasi email Anda sebelum login.";
  }

  if (message.includes("fetch failed") || message.includes("network")) {
    return "Koneksi terganggu. Periksa koneksi internet Anda.";
  }

  return fallback;
}
