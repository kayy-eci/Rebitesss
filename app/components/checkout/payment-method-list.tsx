'use client';

import { ShieldCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useCheckout } from './checkout-context';

export function PaymentMethodList() {
  const { methods, selectedMethod, selectMethod } = useCheckout();
  const SelectedIcon = selectedMethod?.icon;

  return (
    <div className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-medium text-charcoal-900">
          Metode pembayaran
        </h3>
        <span className="inline-flex items-center gap-1.5 text-xs text-sage-500">
<<<<<<< HEAD
          <ShieldCheck className="h-4 w-4 text-primary" />
          Diproses aman lewat Midtrans
=======
          <ShieldCheck className="h-4 w-4 text-green-700" />
          Diproses aman lewat Xendit
>>>>>>> d0863e72367b4f2e60be2378a497824ff4b965bc
        </span>
      </div>

      <Select
        value={selectedMethod?.id ?? ''}
        onValueChange={(id) => selectMethod(id)}
      >
        <SelectTrigger
          aria-label="Pilih metode pembayaran"
          className="mt-4 h-auto w-full rounded-xl border-sage-100 bg-white px-4 py-3 data-[placeholder]:text-sage-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold text-charcoal-900">
            {SelectedIcon && (
              <SelectedIcon className="h-4 w-4 shrink-0 text-primary" />
            )}
            <SelectValue placeholder="Pilih metode pembayaran" />
          </span>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-sage-100">
          {methods.map((method) => {
            const Icon = method.icon;
            return (
              <SelectItem key={method.id} value={method.id}>
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  {method.name}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedMethod && (
        <p className="mt-2.5 text-xs leading-relaxed text-charcoal-500">
          {selectedMethod.description}
        </p>
      )}
    </div>
  );
}
