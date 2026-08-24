export type BillingCycle = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  slug: 'basic' | 'standar' | 'premium';
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  popular: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    slug: 'basic',
    name: 'Basic',
    tagline: 'Mulai jualan di ReBites tanpa biaya, selamanya.',
    monthly: 0,
    yearly: 0,
    features: [
      'Gratis tanpa biaya langganan',
      'Maksimal 5 produk',
      'Riwayat penjualan 30 hari',
      'Dashboard penjualan',
    ],
    cta: 'Mulai Jual',
    popular: false,
  },
  {
    slug: 'standar',
    name: 'Standar',
    tagline: 'Untuk UMKM yang mulai aktif berjualan di ReBites.',
    monthly: 49_000,
    yearly: 490_000,
    features: [
      'Maksimal 25 produk',
      'Riwayat penjualan tanpa batas',
      'Prioritas di marketplace',
      'Laporan penjualan detail',
      'Badge UMKM Terverifikasi',
    ],
    cta: 'Pilih Standar',
    popular: true,
  },
  {
    slug: 'premium',
    name: 'Max',
    tagline: 'Untuk usaha yang ingin berkembang lebih jauh.',
    monthly: 99_000,
    yearly: 990_000,
    features: [
      'Produk tanpa batas',
      'Semua fitur Standar',
      'Promosi unggulan',
      'Analitik permintaan',
      'Dukungan prioritas',
    ],
    cta: 'Pilih Premium',
    popular: false,
  },
];

export function getSubscriptionPlan(
  slug: string | null | undefined
): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.slug === slug);
}

export function getPlanPrice(
  plan: SubscriptionPlan,
  billing: BillingCycle
): number {
  return billing === 'yearly' ? plan.yearly : plan.monthly;
}

export function computePeriodEnd(billing: BillingCycle, from = Date.now()): Date {
  const end = new Date(from);
  if (billing === 'yearly') end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);
  return end;
}
