'use client';

import { Ticket } from 'lucide-react';
import { useCheckout } from './checkout-context';

export function PickupCodeNote() {
  const { draft } = useCheckout();

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sage-100 bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-green-700">
        <Ticket className="h-5 w-5" />
      </span>
      <p className="text-xs leading-relaxed text-charcoal-500">
        Setelah pembayaran berhasil, kode pengambilan untuk{' '}
        <span className="font-semibold text-charcoal-900">
          {draft.productName}
        </span>{' '}
        akan muncul di halaman profil dan ditunjukkan ke mitra saat mengambil
        pesanan.
      </p>
    </div>
  );
}
