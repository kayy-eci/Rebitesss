"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { supabase } from "@/lib/supabase";
import {
  getDashboardPath,
  getAuthErrorMessage,
  normalizeRole,
} from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function LoginPublic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirectedFrom") ?? "/";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        const role = normalizeRole(
          (profileData?.role as string | undefined) ??
            (session.user.user_metadata?.role as string | undefined) ??
            null,
        );

        router.replace(
          redirectTarget.startsWith("/login")
            ? getDashboardPath(role ?? undefined)
            : redirectTarget,
        );
      }
    };

    void restoreSession();
  }, [redirectTarget, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (signInError) {
      setError(getAuthErrorMessage(signInError.message));
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    const profileRole = normalizeRole(
      (profileData?.role as string | undefined) ??
        (data.user?.user_metadata?.role as string | undefined) ??
        null,
    );
    const destination = redirectTarget.startsWith("/login")
      ? getDashboardPath(profileRole ?? undefined)
      : redirectTarget;

    toast({
      title: "Login berhasil",
      description: "Sesi Anda siap digunakan.",
    });

    router.replace(destination);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
      <Card className="w-full max-w-md border-border/70 bg-background/95 shadow-[0_14px_50px_-20px_rgba(0,0,0,0.35)]">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Masuk ke ReBites</CardTitle>
          <CardDescription>
            Gunakan akun Anda untuk masuk ke dashboard sesuai peran.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
