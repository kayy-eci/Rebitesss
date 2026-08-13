export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF] px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-3xl font-semibold text-[#3B5240]">
          Verifikasi Email
        </h1>

        <p className="mt-4 font-sans text-sm leading-relaxed text-[#6B6A63]">
          Akun berhasil dibuat. Silakan cek email kamu untuk mendapatkan
          kode verifikasi.
        </p>
      </div>
    </main>
  );
}