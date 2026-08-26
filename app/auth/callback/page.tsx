"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        let session: { user: unknown } | null = null;
        for (let attempt = 0; attempt < 10 && !session; attempt += 1) {
          // detectSessionInUrl memproses token pada hash URL saat client dibuat.
          const {
            data: { session: current },
          } = await supabase.auth.getSession();
          session = current;
          if (!session) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
        if (cancelled) return;
        router.replace(session ? "/home" : "/auth/login");
      } catch {
        if (!cancelled) {
          setFailed(true);
          router.replace("/auth/login");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF] px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        {!failed && (
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#225138] border-t-transparent" />
        )}
        <p className="font-sans text-sm text-[#6B6A63]">
          {failed
            ? "Verifikasi gagal. Silakan masuk kembali."
            : "Memverifikasi email kamu…"}
        </p>
      </div>
    </div>
  );
}
