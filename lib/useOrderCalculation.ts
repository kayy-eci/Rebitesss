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

/** Nilai tukar 1 ReBites Coin dalam Rupiah: 1 Coin = Rp1 potongan. */
export const COIN_VALUE = 1;

/** Estimasi pesanan siap diambil pada mode Pickup. */
export const PICKUP_READY_ESTIMATE = '±20–30 menit';

interface OrderCalculationInput {
  draft: OrderDraft;
  quantity: number;
  fulfillment: FulfillmentMode;
  promo: PromoCode | null;
  /** Toggle "Gunakan ReBites Coin" — default OFF, tidak wajib. */
  useCoins?: boolean;
  /** Saldo Coin terkini dari sumber data tunggal (useRebitesCoins). */
  coinBalance?: number;
}

/**
 * Mesin perhitungan terpusat checkout.
 * Semua angka di UI harus berasal dari sini agar tidak ada selisih.
 *
 * Urutan kalkulasi:
 *   Subtotal → Diskon Promo → Biaya Layanan 2% → Biaya Pengantaran
 *   → totalBeforeCoin → Potongan ReBites Coin → total
 */
export function useOrderCalculation({
  draft,
  quantity,
  fulfillment,
  promo,
  useCoins = false,
  coinBalance = 0,
}: OrderCalculationInput): CheckoutSummary {
  return useMemo(() => {
    const subtotal = draft.discountedPrice * quantity;
    const discount = promo?.isValid
      ? Math.round((subtotal * promo.percentOff) / 100)
      : 0;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
    const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0;
    const totalBeforeCoin = Math.max(
      0,
      subtotal - discount + serviceFee + deliveryFee,
    );

    /* 1 Coin = Rp1 — pakai maksimal saldo, tidak pernah melebihi tagihan. */
    const coinUsed = useCoins
      ? Math.min(Math.max(0, Math.floor(coinBalance)), totalBeforeCoin)
      : 0;
    const coinDiscount = coinUsed;
    const remainingCoin = Math.max(0, Math.floor(coinBalance) - coinUsed);
    const total = Math.max(0, totalBeforeCoin - coinDiscount);

    const coinEarned = Math.floor(subtotal * REBITES_COIN_RATE);
    const totalSavings =
      (draft.originalPrice - draft.discountedPrice) * quantity;
    const co2eSaved = draft.co2ePerUnitKg * quantity;

    return {
      subtotal,
      discount,
      serviceFee,
      deliveryFee,
      totalBeforeCoin,
      coinUsed,
      coinDiscount,
      remainingCoin,
      total,
      totalSavings,
      co2eSaved,
      coinEarned,
    };
  }, [draft, quantity, fulfillment, promo, useCoins, coinBalance]);
}
