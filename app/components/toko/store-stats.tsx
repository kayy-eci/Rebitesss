'use client';

import { Recycle, ShoppingBag, Star, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '@/app/components/dashboardPenjual/useCountUp';
import { STORE } from './data';

interface StatDef {
  id: string;
  icon: LucideIcon;
  value: number;
  decimals: number;
  label: string;
}

const STATS: StatDef[] = [
  {
    id: 'terjual',
    icon: ShoppingBag,
    value: STORE.ordersServed,
    decimals: 0,
    label: 'Porsi Terjual',
  },
  {
    id: 'rating',
    icon: Star,
    value: STORE.rating,
    decimals: 1,
    label: 'Rating Pembeli',
  },
  {
    id: 'pengikut',
    icon: Users,
    value: STORE.followers,
    decimals: 0,
    label: 'Pengikut Toko',
  },
  {
    id: 'co2',
    icon: Recycle,
    value: STORE.co2eSaved,
    decimals: 0,
    label: 'kg CO₂e Terhindar',
  },
];

function StatTile({ stat }: { stat: StatDef }) {
  const Icon = stat.icon;
  const { ref, value } = useCountUp(stat.value, 1500, stat.decimals);

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-sage-100 bg-white p-4 shadow-sm sm:p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-100 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-2xl font-medium leading-none tracking-tight text-primary">
          <span ref={ref}>{value}</span>
        </p>
        <p className="mt-1 text-[11px] font-medium text-sage-500">{stat.label}</p>
      </div>
    </div>
  );
}

export function StoreStats() {
  return (
    <section
      className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Statistik toko"
    >
      {STATS.map((stat) => (
        <StatTile key={stat.id} stat={stat} />
      ))}
    </section>
  );
}
