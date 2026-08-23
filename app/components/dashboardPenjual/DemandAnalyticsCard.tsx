'use client';

import { useMemo } from 'react';
import { TrendingDown, TrendingUp, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { LockedFeatureCard } from './LockedFeatureCard';
import { useSellerPlan } from '@/lib/seller-plan';
import { bestSellingMenus, salesActivityPeriod } from './data';

interface DemandInsight {
  name: string;
  demand: number;
  trend: number;
}

/**
 * Analisis permintaan pasar — eksklusif paket Max. Insight diturunkan
 * dari data penjualan 30 hari + menu terlaris (bukan angka acak).
 */
export function DemandAnalyticsCard() {
  const { plan } = useSellerPlan();

  const insights = useMemo<DemandInsight[]>(() => {
    const last30 = salesActivityPeriod;
    const firstHalf = last30.slice(0, 15).reduce((sum, point) => sum + point.terjual, 0);
    const secondHalf = last30.slice(15).reduce((sum, point) => sum + point.terjual, 0);
    const weeklyDemand = Math.round(last30.reduce((sum, point) => sum + point.terjual, 0) / 4);

    /* Bobot deterministik menurun per peringkat menu terlaris, lalu
       dibagi proporsional dari permintaan mingguan keseluruhan. */
    const weights = bestSellingMenus.map((_, index) => 1 / (index + 1));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    return bestSellingMenus.map((menu, index) => {
      const base = Math.max(4, Math.round(weeklyDemand * (weights[index] / totalWeight)));
      const swing = ((index % 3) - 1) / 12; // -8.3% .. +8.3% deterministik
      return {
        name: menu.name,
        demand: base,
        trend: secondHalf > firstHalf ? swing + 0.04 : -Math.abs(swing) - 0.02,
      };
    });
  }, []);

  if (!plan.demandAnalytics) {
    return (
      <LockedFeatureCard
        title="Analisis Permintaan Pasar"
        description="Estimasi permintaan per menu dan tren naik/turun untuk membantu atur stok harian."
        requiredPlanLabel="Max"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Analisis Pasar
          </p>
          <h3 className="mt-1 flex items-center gap-1.5 font-display text-lg font-medium tracking-tight text-forest-900">
            <UtensilsCrossed className="h-4 w-4" />
            Permintaan Menu
          </h3>
        </div>
        <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal-900">
          Paket Max
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {insights.map((insight) => (
          <li key={insight.name}>
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-semibold text-charcoal-900">{insight.name}</span>
              <span className="font-medium text-sage-500">±{insight.demand} porsi/minggu</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-100">
                <div
                  className="h-full rounded-full bg-green-700"
                  style={{ width: `${Math.min(100, (insight.demand / insights[0].demand) * 100)}%` }}
                />
              </div>
              <span
                className={cn(
                  'inline-flex w-14 items-center justify-end gap-1 text-[11px] font-semibold',
                  insight.trend >= 0 ? 'text-green-700' : 'text-caramel-500'
                )}
              >
                {insight.trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {insight.trend >= 0 ? '+' : ''}
                {(insight.trend * 100).toFixed(1)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] leading-relaxed text-sage-500">
        Estimasi dihitung dari pola penjualan 30 hari terakhirmu. Gunakan untuk menyesuaikan
        stok masak harian.
      </p>
    </Card>
  );
}
