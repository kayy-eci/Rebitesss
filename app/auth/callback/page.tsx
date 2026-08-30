"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/home";
  return raw;
}

function CallbackStatus({ failed }: { failed: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        {!failed && (
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
        <p className="font-sans text-sm text-muted-foreground">
          {failed
            ? "Verifikasi gagal. Silakan masuk kembali."
            : "Memverifikasi email kamu…"}
        </p>
      </div>
    </div>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const nextPath = safeNextPath(searchParams.get("next"));

    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        let session: { user: unknown } | null = null;
        for (let attempt = 0; attempt < 10 && !session; attempt += 1) {
          
          const {
            data: { session: current },
          } = await supabase.auth.getSession();
          session = current;
          if (!session) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
        if (cancelled) return;
        router.replace(session ? nextPath : "/auth/login");
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
  }, [router, searchParams]);

  return <CallbackStatus failed={failed} />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackStatus failed={false} />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
