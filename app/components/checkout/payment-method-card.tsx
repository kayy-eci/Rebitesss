'use client';

import { motion } from 'framer-motion';
import type { PaymentMethod } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCheckout } from './checkout-context';

export function PaymentMethodCard({
  method,
}: {
  method: PaymentMethod;
}) {
  const { selectedMethod, selectMethod } = useCheckout();
  const selected = selectedMethod?.id === method.id;
  const Icon = method.icon;

  return (
    <label
      className={cn(
        'group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 bg-white p-4 transition-all duration-200 sm:p-5',
        selected
          ? 'border-green-700 bg-green-700/[0.05] shadow-lg shadow-green-700/10'
          : 'border-sage-100 hover:border-sage-500/50 hover:shadow-md'
      )}
    >
      <input
        type="radio"
        name="payment-method"
        value={method.id}
        checked={selected}
        onChange={() => selectMethod(method.id)}
        className="sr-only"
      />

      <span
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
          selected ? 'bg-green-700 text-white' : 'bg-sage-100 text-green-700'
        )}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-charcoal-900">
          {method.name}
        </span>
        <span className="mt-0.5 block truncate text-xs text-charcoal-500">
          {method.description}
        </span>
      </span>

      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200',
          selected ? 'border-green-700' : 'border-sage-500/70'
        )}
      >
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 24 }}
            className="h-2.5 w-2.5 rounded-full bg-green-700"
          />
        )}
      </span>
    </label>
  );
}
