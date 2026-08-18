import Link from "next/link";

export default function PembeliLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF] px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[#225138]">
          Login Pembeli
        </h1>
        <p className="mt-3 text-sm text-[#6B6A63]">
          Halaman ini masih dalam pengembangan.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block font-sans text-sm font-semibold text-[#225138] underline underline-offset-4"
        >
          Kembali ke halaman login
        </Link>
      </div>
    </main>
  );
}
