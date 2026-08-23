'use client';

import { useEffect, useState } from 'react';
import {
  getActiveSubscription,
  SUBSCRIPTION_UPDATED_EVENT,
  type StoredSubscription,
} from './subscription-storage';

/**
 * Entitlement paket penjual — satu-satunya sumber kebenaran untuk
 * pembatasan fitur berdasarkan langganan.
 *
 * - Tanpa langganan aktif (kosong/kadaluarsa/dibatalkan) → ReBites Basic.
 * - Slug `premium` pada subscription-storage ditampilkan sebagai "Max".
 */

export type SellerTier = 'basic' | 'standar' | 'max';

export interface SellerEntitlements {
  tier: SellerTier;
  label: string;
  /** Maksimal produk yang boleh disimpan; null = tanpa batas. */
  maxProducts: number | null;
  /** Lama riwayat penjualan (hari); null = tanpa batas. */
  historyDays: number | null;
  detailedReport: boolean;
  verifiedBadge: boolean;
  priorityListing: boolean;
  featuredPromo: boolean;
  demandAnalytics: boolean;
  prioritySupport: boolean;
  /** Slug paket untuk CTA upgrade; null = sudah tertinggi. */
  upgradeSlug: 'standar' | 'premium' | null;
}

const ENTITLEMENTS: Record<SellerTier, SellerEntitlements> = {
  basic: {
    tier: 'basic',
    label: 'ReBites Basic',
    maxProducts: 5,
    historyDays: 30,
    detailedReport: false,
    verifiedBadge: false,
    priorityListing: false,
    featuredPromo: false,
    demandAnalytics: false,
    prioritySupport: false,
    upgradeSlug: 'standar',
  },
  standar: {
    tier: 'standar',
    label: 'ReBites Standar',
    maxProducts: 25,
    historyDays: null,
    detailedReport: true,
    verifiedBadge: true,
    priorityListing: true,
    featuredPromo: false,
    demandAnalytics: false,
    prioritySupport: false,
    upgradeSlug: 'premium',
  },
  max: {
    tier: 'max',
    label: 'ReBites Max',
    maxProducts: null,
    historyDays: null,
    detailedReport: true,
    verifiedBadge: true,
    priorityListing: true,
    featuredPromo: true,
    demandAnalytics: true,
    prioritySupport: true,
    upgradeSlug: null,
  },
};

export function getSellerEntitlements(
  subscription: StoredSubscription | null
): SellerEntitlements {
  if (!subscription) return ENTITLEMENTS.basic;
  if (subscription.planSlug === 'standar') return ENTITLEMENTS.standar;
  if (subscription.planSlug === 'premium') return ENTITLEMENTS.max;
  return ENTITLEMENTS.basic;
}

/** Pembacaan sinkron (client-only) tanpa hook. */
export function readSellerPlan(): SellerEntitlements {
  if (typeof window === 'undefined') return ENTITLEMENTS.basic;
  return getSellerEntitlements(getActiveSubscription());
}

/**
 * Paket penjual saat ini sebagai React state — ikut segar ketika
 * langganan dibeli/ganti di tab lain maupun tab yang sama.
 */
export function useSellerPlan() {
  const [plan, setPlan] = useState<SellerEntitlements>(ENTITLEMENTS.basic);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setPlan(readSellerPlan());
      setHydrated(true);
    };

    refresh();
    window.addEventListener(SUBSCRIPTION_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(SUBSCRIPTION_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { plan, hydrated };
}
