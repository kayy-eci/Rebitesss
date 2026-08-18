'use client';

import { ShieldCheck } from 'lucide-react';
import { useCheckout } from './checkout-context';
import { PaymentMethodCard } from './payment-method-card';

export function PaymentMethodList() {
  const { methods } = useCheckout();

  return (
    <div className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-medium text-charcoal-900">
          Metode pembayaran
        </h3>
        <span className="inline-flex items-center gap-1.5 text-xs text-sage-500">
          <ShieldCheck className="h-4 w-4 text-green-700" />
          Diproses aman lewat Midtrans
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {methods.map((method) => (
          <PaymentMethodCard key={method.id} method={method} />
        ))}
      </div>
    </div>
  );
}
