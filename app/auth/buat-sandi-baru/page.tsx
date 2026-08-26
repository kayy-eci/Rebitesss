import type { Metadata } from "next";
import AuthShell from "@/app/components/auth/auth-shell";
import BuatSandiBaruForm from "@/app/components/auth/buat-sandi-baru-form";

export const metadata: Metadata = {
  title: "Buat Kata Sandi Baru - ReBites",
  description:
    "Tentukan kata sandi baru untuk akun ReBites Anda dan lanjutkan misi menyelamatkan makanan surplus.",
};

export default function BuatSandiBaruPage() {
  return (
    <AuthShell
      brand={{
        title: (
          <>
            Amankan Akunmu,
            <br />
            Lanjutkan Misimu.
          </>
        ),
        description:
          "Tautan reset kamu sudah terverifikasi. Buat kata sandi baru agar akun ReBites-mu kembali aman dan siap dipakai.",
      }}
    >
      <BuatSandiBaruForm />
    </AuthShell>
  );
}
