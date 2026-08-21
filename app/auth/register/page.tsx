import type { Metadata } from "next";
import AuthSplit from "@/app/components/auth/auth-split";

export const metadata: Metadata = {
  title: "Daftar - ReBites",
  description:
    "Buat akun untuk bergabung dengan marketplace kuliner surplus ReBites.",
};

export default function RegisterPage() {
  return (
    <AuthSplit
      mode="signup"
      title={
        <>
          Buat Akun
          <br />
          Baru
        </>
      }
      subtitle="Create your account to join our curated marketplace."
      submitLabel="Buat Akun"
      redirectTo="/"
      bottomHint={{
        text: "Sudah punya akun?",
        linkText: "Masuk",
        href: "/auth/login",
      }}
      brand={{
        title: (
          <>
            Taste good,
            <br />
            do good.
          </>
        ),
        description:
          "Join our curated marketplace connecting premium palates with sustainable culinary surplus. Reducing waste, beautifully.",
      }}
    />
  );
}