'use client';

import { supabase } from './supabase';
import {
  computePeriodEnd,
  type BillingCycle,
} from './subscription-plans';
import { createNotification } from './notification-storage';
import { getSellerUmkm } from './product-storage';

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

export const SUBSCRIPTION_UPDATED_EVENT = 'rebites-subscription-updated';

function dispatchUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SUBSCRIPTION_UPDATED_EVENT));
}

type SubscriptionRow = Record<string, any>;

function rowToStoredSubscription(row: SubscriptionRow): StoredSubscription | null {
  const planSlug = row.plans?.slug as string | undefined;
  if (!planSlug) return null;
  return {
    id: row.id,
    planSlug: planSlug as StoredSubscription['planSlug'],
    billing: (row.billing ?? 'monthly') as BillingCycle,
    pricePaid: row.price_paid ?? row.plans?.price_monthly ?? 0,
    status: row.status,
    startedAt: row.current_period_start ?? row.created_at,
    currentPeriodEnd: row.current_period_end ?? '',
    paymentMethodId: row.payment_method_id ?? null,
    updatedAt: row.updated_at ?? row.created_at,
  };
}

async function getOwnUmkmId(): Promise<string | null> {
  const umkm = await getSellerUmkm();
  return umkm?.id ?? null;
}

export async function getSubscription(): Promise<StoredSubscription | null> {
  const umkmId = await getOwnUmkmId();
  if (!umkmId) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plans(slug, name, price_monthly, price_yearly)')
    .eq('umkm_id', umkmId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return rowToStoredSubscription(data);
}

export async function getActiveSubscription(): Promise<StoredSubscription | null> {
  const subscription = await getSubscription();
  if (!subscription) return null;
  if (subscription.status !== 'active') return null;
  if (new Date(subscription.currentPeriodEnd).getTime() <= Date.now()) {
    return null;
  }
  return subscription;
}

export interface SaveSubscriptionInput {
  planSlug: StoredSubscription['planSlug'];
  billing: BillingCycle;
  paymentMethodId: string | null;
}

export async function saveSubscription(
  input: SaveSubscriptionInput
): Promise<StoredSubscription | null> {
  const umkmId = await getOwnUmkmId();
  if (!umkmId) {
    console.error('[subscription] tidak ada profil UMKM untuk user ini.');
    return null;
  }

  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('id, slug, name, price_monthly, price_yearly')
    .eq('slug', input.planSlug)
    .maybeSingle();
  if (planError || !plan) {
    console.error('[subscription] paket tidak ditemukan:', planError?.message);
    return null;
  }

  const now = new Date();
  const periodStart = now.toISOString();
  const periodEnd = computePeriodEnd(input.billing, now.getTime()).toISOString();
  const pricePaid =
    input.billing === 'yearly' ? plan.price_yearly : plan.price_monthly;

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      umkm_id: umkmId,
      plan_id: plan.id,
      status: 'active',
      billing: input.billing,
      price_paid: pricePaid,
      payment_method_id: input.paymentMethodId,
      current_period_start: periodStart,
      current_period_end: periodEnd,
    })
    .select('*, plans(slug, name, price_monthly, price_yearly)')
    .maybeSingle();
  if (error || !data) {
    console.error('[subscription] gagal menyimpan langganan:', error?.message);
    return null;
  }

  dispatchUpdated();

  const subscription = rowToStoredSubscription(data);
  if (subscription) {
    const billingLabel = input.billing === 'yearly' ? 'Tahunan' : 'Bulanan';
    const periodEndLabel = new Date(periodEnd).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (uid) {
      await createNotification({
        userId: uid,
        role: 'seller',
        type: 'subscription_active',
        title: 'Langganan Aktif!',
        message: `Paket ReBites ${plan.name} (${billingLabel}) berhasil diaktifkan. Berlaku hingga ${periodEndLabel}.`,
        referenceId: subscription.id,
        href: '/dashboard/penjual',
      });
    }
  }

  return subscription;
}
