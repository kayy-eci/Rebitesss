'use client';

import { useMemo } from 'react';
import type {
  CheckoutSummary,
  FulfillmentMode,
  OrderDraft,
  PromoCode,
} from './types';

/** Biaya layanan pembayaran: 2% dari subtotal produk (sebelum diskon promo). */
export const SERVICE_FEE_RATE = 0.02;

/**
 * Biaya pengantaran flat untuk mode Delivery.
 * Single source of truth — ubah hanya di sini.
 */
export const DELIVERY_FEE = 8000;

/** Persentase ReBites Coin yang diperoleh dari subtotal produk. */
export const REBITES_COIN_RATE = 0.02;

/** Nilai tukar 1 ReBites Coin dalam Rupiah (untuk fitur redeem di masa depan). */
export const COIN_VALUE = 1;

/** Estimasi pesanan siap diambil pada mode Pickup. */
export const PICKUP_READY_ESTIMATE = '±20–30 menit';

interface OrderCalculationInput {
  draft: OrderDraft;
  quantity: number;
  fulfillment: FulfillmentMode;
  promo: PromoCode | null;
}

/**
 * Mesin perhitungan terpusat checkout.
 * Semua angka di UI harus berasal dari sini agar tidak ada selisih.
 */
export function useOrderCalculation({
  draft,
  quantity,
  fulfillment,
  promo,
}: OrderCalculationInput): CheckoutSummary {
  return useMemo(() => {
    const subtotal = draft.discountedPrice * quantity;
    const discount = promo?.isValid
      ? Math.round((subtotal * promo.percentOff) / 100)
      : 0;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
    const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0;
    const total = Math.max(0, subtotal - discount + serviceFee + deliveryFee);
    const coinEarned = Math.floor(subtotal * REBITES_COIN_RATE);
    const totalSavings =
      (draft.originalPrice - draft.discountedPrice) * quantity;
    const co2eSaved = draft.co2ePerUnitKg * quantity;

    return {
      subtotal,
      discount,
      serviceFee,
      deliveryFee,
      total,
      totalSavings,
      co2eSaved,
      coinEarned,
    };
  }, [draft, quantity, fulfillment, promo]);
}
