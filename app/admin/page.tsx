"use client";

import { ProtectedRoute } from "@/app/components/auth-guard";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-2xl rounded-[var(--radius)] border border-border/70 bg-card p-8 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Admin Dashboard
          </p>
          <h1 className="mt-3 font-display text-3xl text-primary">
            Selamat datang di dashboard admin
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Area ini hanya dapat diakses oleh akun dengan peran admin.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
