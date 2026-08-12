import type { Metadata } from "next";
import AuthSplit from "@/app/components/auth/auth-split";

export const metadata: Metadata = {
  title: "Login Admin - ReBites",
  description: "Akses panel administrasi ReBites.",
};

export default function AdminLoginPage() {
  return (
    <AuthSplit
      mode="signin"
      title={
        <>
          Login
          <br />
          Admin
        </>
      }
      subtitle="Access the ReBites administration panel."
      submitLabel="Sign In"
      redirectTo="/"
      bottomHint={{
        text: "Bukan admin?",
        linkText: "Kembali ke login",
        href: "/login",
      }}
      brand={{
        title: (
          <>
            Run the
            <br />
            Marketplace.
          </>
        ),
        description:
          "Manage merchants, products, and orders from the ReBites admin console.",
      }}
    />
  );
}
