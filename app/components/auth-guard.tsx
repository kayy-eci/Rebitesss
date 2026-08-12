"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/auth-provider";
import {
  getDashboardPath,
  normalizeRole,
  type AuthRoleChoice,
} from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AuthRoleChoice;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      const redirectTarget = searchParams.get("redirectedFrom") ?? pathname;
      const loginUrl = `/login?redirectedFrom=${encodeURIComponent(redirectTarget)}`;
      router.replace(loginUrl);
      return;
    }

    if (requiredRole) {
      const normalizedRole = normalizeRole(role ?? undefined);

      if (normalizedRole !== requiredRole) {
        router.replace(getDashboardPath(normalizedRole ?? undefined));
      }
    }
  }, [loading, pathname, requiredRole, role, router, searchParams, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-[var(--radius)] border border-border/70 bg-card px-6 py-4 text-sm text-muted-foreground">
          Memeriksa sesi autentikasi...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole) {
    const normalizedRole = normalizeRole(role ?? undefined);

    if (normalizedRole !== requiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
