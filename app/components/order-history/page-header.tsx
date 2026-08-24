'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function OrderPageHeader() {
  const router = useRouter();

  return (
    <section>
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 -ml-2 text-[13px] font-semibold text-charcoal-500 transition-colors hover:bg-white hover:text-green-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      <h1 className="mt-3 font-display text-2xl font-medium tracking-tight text-charcoal-900 sm:text-3xl">
        Pesanan Saya
      </h1>
      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-charcoal-500">
        Lihat dan pantau semua pesanan yang sedang berlangsung maupun yang
        sudah selesai.
      </p>
    </section>
  );
}
