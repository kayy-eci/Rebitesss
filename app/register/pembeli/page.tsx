import type { Metadata } from "next";
import AuthSplit from "@/app/components/auth/auth-split";

export const metadata: Metadata = {
  title: "Daftar Pembeli - ReBites",
  description:
    "Buat akun pembeli untuk mulai menyelamatkan makanan surplus terdekat.",
};

export default function RegisterPembeliPage() {
  return (
    <AuthSplit
      mode="signup"
      title={
        <>
          Daftar
          <br />
          Pembeli
        </>
      }
      subtitle="Create your account to start saving surplus food near you."
      submitLabel="Buat Akun"
      redirectTo="/"
      bottomHint={{
        text: "Sudah punya akun?",
        linkText: "Masuk",
        href: "/login",
      }}
      brand={{
        title: (
          <>
            Fresh finds,
            <br />
            less waste.
          </>
        ),
        description:
          "Discover discounted meals from local kitchens — saving money and the planet.",
      }}
    />
  );
}
