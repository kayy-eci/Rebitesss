import type { Metadata } from "next";
import AuthShell from "@/app/components/auth/auth-shell";
import PenjualRegisterForm from "@/app/components/auth/penjual-register-form";

export const metadata: Metadata = {
  title: "Daftar Penjual - ReBites",
  description:
    "Buat akun penjual untuk bergabung dengan marketplace kuliner surplus ReBites.",
};

export default function RegisterPenjualPage() {
  return (
    <AuthShell
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
    >
      <PenjualRegisterForm />
    </AuthShell>
  );
}
