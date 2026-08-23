'use client';

import Link from 'next/link';
import { BadgeCheck, Crown, History, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from './Card';
import { useSellerPlan } from '@/lib/seller-plan';
import { getSellerProductCount } from '@/lib/product-storage';

/**
 * Ringkasan paket aktif: batas produk, jendela riwayat, dan benefit
 * prioritas — dengan tautan kelola langganan.
 */
export function PackageStatusCard() {
  const { plan } = useSellerPlan();
  const used = getSellerProductCount();

  const benefits = [
    {
      icon: Layers,
      label: 'Batas Produk',
      value: plan.maxProducts === null ? 'Tanpa batas' : `${used}/${plan.maxProducts} produk`,
    },
    {
      icon: History,
      label: 'Riwayat Penjualan',
      value:
        plan.historyDays === null
          ? 'Tanpa batas waktu'
          : `${plan.historyDays} hari terakhir`,
    },
    {
      icon: BadgeCheck,
      label: 'Lencana UMKM Terverifikasi',
      value: plan.verifiedBadge ? 'Aktif' : 'Belum termasuk',
    },
    {
      icon: Sparkles,
      label: 'Menu Unggulan & Analisis Pasar',
      value: plan.featuredPromo && plan.demandAnalytics ? 'Aktif' : 'Paket Max saja',
    },
    {
      icon: ShieldCheck,
      label: 'Prioritas Pencarian & Dukungan',
      value: plan.priorityListing ? 'Aktif' : 'Belum termasuk',
    },
  ];

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Paket Langganan
          </p>
          <h3 className="mt-1 flex items-center gap-1.5 font-display text-lg font-medium tracking-tight text-forest-900">
            <Crown className="h-4 w-4 text-gold-500" />
            ReBites {plan.label}
          </h3>
        </div>
        {plan.upgradeSlug === null && (
          <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal-900">
            Paket Tertinggi
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-2.5">
        {benefits.map((benefit) => (
          <li key={benefit.label} className="flex items-center gap-3 text-xs">
            <benefit.icon className="h-3.5 w-3.5 shrink-0 text-green-700" />
            <span className="flex-1 font-medium text-charcoal-900">{benefit.label}</span>
            <span className="font-semibold text-sage-500">{benefit.value}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/langganan"
        className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-green-700 px-5 py-2.5 text-xs font-semibold text-green-700 transition-colors hover:bg-green-700/10"
      >
        Kelola Paket Langganan
      </Link>
    </Card>
  );
}
