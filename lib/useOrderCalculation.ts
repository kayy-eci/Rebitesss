'use client';

import { useMemo } from 'react';
import type {
  CheckoutSummary,
  OrderDraft,
  PaymentMethod,
  PromoCode,
} from './types';

export const SERVICE_FEE = 1000;

export function useOrderCalculation(
  draft: OrderDraft,
  quantity: number,
  method: PaymentMethod | null,
  promo: PromoCode | null
): CheckoutSummary {
  return useMemo(() => {
    const subtotal = draft.discountedPrice * quantity;
    const methodFee = method?.fee ?? 0;
    const promoDiscount = promo?.isValid ? promo.discountAmount : 0;
    const total = Math.max(0, subtotal + SERVICE_FEE + methodFee - promoDiscount);
    const totalSavings = (draft.originalPrice - draft.discountedPrice) * quantity;
    const co2eSaved = draft.co2ePerUnitKg * quantity;

    return {
      subtotal,
      serviceFee: SERVICE_FEE,
      methodFee,
      promoDiscount,
      total,
      totalSavings,
      co2eSaved,
    };
  }, [draft, quantity, method, promo]);
}
