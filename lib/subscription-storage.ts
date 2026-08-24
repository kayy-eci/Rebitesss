const STORAGE_KEY = 'rebites-subscription';

export const SUBSCRIPTION_UPDATED_EVENT = 'rebites-subscription-updated';

import {
  computePeriodEnd,
  getPlanPrice,
  getSubscriptionPlan,
  type BillingCycle,
} from './subscription-plans';
import { createNotification } from './notification-storage';
import { SELLER_VENDOR_SLUG } from './product-storage';

export type StoredSubscriptionStatus = 'active' | 'expired' | 'cancelled';

export interface StoredSubscription {
  id: string;
  planSlug: 'basic' | 'standar' | 'premium';
  billing: BillingCycle;

  pricePaid: number;
  status: StoredSubscriptionStatus;
  startedAt: string;
  currentPeriodEnd: string;
  paymentMethodId: string | null;
  updatedAt: string;
}

function readRaw(): StoredSubscription | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSubscription) : null;
  } catch {
    return null;
  }
}

function writeRaw(subscription: StoredSubscription | null) {
  if (typeof window === 'undefined') return;
  try {
    if (subscription === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
    }
    window.dispatchEvent(new Event(SUBSCRIPTION_UPDATED_EVENT));
  } catch {

  }
}

export function createSubscriptionId(): string {
  return `SUB-${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export interface SaveSubscriptionInput {
  planSlug: StoredSubscription['planSlug'];
  billing: BillingCycle;
  paymentMethodId: string | null;
}

export function saveSubscription(
  input: SaveSubscriptionInput
): StoredSubscription | null {
  const plan = getSubscriptionPlan(input.planSlug);
  if (!plan || typeof window === 'undefined') return null;

  const now = Date.now();
  const subscription: StoredSubscription = {
    id: createSubscriptionId(),
    planSlug: plan.slug,
    billing: input.billing,
    pricePaid: getPlanPrice(plan, input.billing),
    status: 'active',
    startedAt: new Date(now).toISOString(),
    currentPeriodEnd: computePeriodEnd(input.billing, now).toISOString(),
    paymentMethodId: input.paymentMethodId,
    updatedAt: new Date(now).toISOString(),
  };

  writeRaw(subscription);

  const billingLabel = input.billing === 'yearly' ? 'Tahunan' : 'Bulanan';
  const periodEnd = computePeriodEnd(input.billing, now).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  createNotification({
    userId: SELLER_VENDOR_SLUG,
    role: 'seller',
    type: 'subscription_active',
    title: 'Langganan Aktif!',
    message: `Paket ReBites ${plan.name} (${billingLabel}) berhasil diaktifkan. Berlaku hingga ${periodEnd}.`,
    referenceId: subscription.id,
    href: '/dashboard/penjual',
  });

  return subscription;
}

export function getSubscription(): StoredSubscription | null {
  return readRaw();
}

export function getActiveSubscription(): StoredSubscription | null {
  const subscription = readRaw();
  if (!subscription) return null;
  if (subscription.status !== 'active') return null;
  if (new Date(subscription.currentPeriodEnd).getTime() <= Date.now()) {
    return null;
  }
  return subscription;
}
