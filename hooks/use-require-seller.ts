"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSellerUmkm, type SellerUmkm } from "@/lib/product-storage";

/**
 * Guard halaman penjual berbasis session + database.
 * - loading  -> tampilkan spinner
 * - tanpa session -> /auth/login
 * - session tanpa toko -> /auth/register/penjual
 */
export function useRequireSeller(): {
  loading: boolean;
  umkm: SellerUmkm | null;
} {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [umkm, setUmkm] = useState<SellerUmkm | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await getSellerUmkm();
        if (!mounted) return;
        if (!profile) {
          const { supabase } = await import("@/lib/supabase");
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (!mounted) return;
          router.replace(session ? "/auth/register/penjual" : "/auth/login");
          return;
        }
        setUmkm(profile);
        setLoading(false);
      } catch {
        if (mounted) router.replace("/auth/login");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return { loading, umkm };
}
