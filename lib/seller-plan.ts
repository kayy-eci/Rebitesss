'use client';

import { useEffect, useState } from 'react';
import {
  SUBSCRIPTION_UPDATED_EVENT,
  getActiveSubscription,
  type StoredSubscription,
} from './subscription-storage';

export type SellerTier = 'basic' | 'standar' | 'max';

export interface SellerEntitlements {
  tier: SellerTier;
  label: string;
  maxProducts: number | null;
  historyDays: number | null;
  maxFlashSaleProducts: number | null;
  detailedReport: boolean;
  verifiedBadge: boolean;
  priorityListing: boolean;
  featuredPromo: boolean;
  demandAnalytics: boolean;
  prioritySupport: boolean;
  upgradeSlug: 'standar' | 'premium' | null;
}

const ENTITLEMENTS: Record<SellerTier, SellerEntitlements> = {
  basic: {
    tier: 'basic',
    label: 'ReBites Basic',
    maxProducts: 5,
    historyDays: 30,
    maxFlashSaleProducts: 0,
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
    maxFlashSaleProducts: 1,
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
    maxFlashSaleProducts: null,
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

export async function readSellerPlan(): Promise<SellerEntitlements> {
  const subscription = await getActiveSubscription();
  return getSellerEntitlements(subscription);
}

export function useSellerPlan() {
  const [plan, setPlan] = useState<SellerEntitlements>(ENTITLEMENTS.basic);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const refresh = () => {
      readSellerPlan().then((result) => {
        if (!mounted) return;
        setPlan(result);
        setHydrated(true);
      });
    };

    refresh();
    window.addEventListener(SUBSCRIPTION_UPDATED_EVENT, refresh);

    return () => {
      mounted = false;
      window.removeEventListener(SUBSCRIPTION_UPDATED_EVENT, refresh);
    };
  }, []);

  return { plan, hydrated };
}
