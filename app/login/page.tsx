import type { Metadata } from "next";
import AuthSplit from "@/app/components/auth/auth-split";

export const metadata: Metadata = {
  title: "Masuk - ReBites",
  description:
    "Masuk ke akun ReBites untuk mengakses marketplace kuliner surplus.",
};

export default function LoginPage() {
  return (
    <AuthSplit
      mode="signin"
      title={
        <>
          Selamat Datang
          <br />
          Kembali
        </>
      }
      subtitle="Masuk menggunakan email dan kata sandi akun ReBites kamu."
      submitLabel="Sign In"
      redirectTo="/home"
      bottomHint={{
        text: "Belum punya akun?",
        linkText: "Daftar di sini",
        href: "/register",
      }}
      brand={{
        title: (
          <>
            Elevate the
            <br />
            Everyday.
          </>
        ),
        description:
          "Join our curated marketplace connecting premium palates with sustainable culinary surplus. Reducing waste, beautifully.",
      }}
    />
  );
}