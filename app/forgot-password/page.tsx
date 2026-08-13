import type { Metadata } from "next";
import AuthShell from "@/app/auth/auth-shell";
import ForgotPasswordForm from "@/app/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi - ReBites",
  description:
    "Atur ulang kata sandi akun ReBites Anda untuk kembali ke marketplace kuliner surplus.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      brand={{
        title: (
          <>
            Kembali Ke
            <br />
            Rasa Terbaik.
          </>
        ),
        description:
          "Tidak apa-apa jika lupa. Kami kirimkan tautan reset ke emailmu agar kamu bisa segera kembali menikmati makanan surplus terbaik.",
      }}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
