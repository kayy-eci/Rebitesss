'use client';

import { useMemo } from 'react';
import { FileText } from 'lucide-react';
import { Card } from './Card';
import { LockedFeatureCard } from './LockedFeatureCard';
import { SalesEmptyState, CardLinesSkeleton } from './SalesEmptyState';
import { useSellerPlan } from '@/lib/seller-plan';
import { useSellerOrders } from '@/hooks/use-seller-orders';
import { AVG_PRICE_PER_PORSI, salesActivityPeriod, salesActivityWeek } from './data';
import { formatRupiah } from '@/lib/data';

export type StatsPeriod = '7-hari' | '14-hari' | '30-hari';

interface ReportRow {
  day: string;
  terjual: number;
  tersisa: number;
  revenue: number;
}

export function DetailedReportCard({ period }: { period: StatsPeriod }) {
  const { plan, hydrated } = useSellerPlan();
  const { hasOrders } = useSellerOrders();

  const rows = useMemo<ReportRow[]>(() => {
    const source =
      period === '7-hari'
        ? salesActivityWeek
        : salesActivityPeriod.slice(-(period === '14-hari' ? 14 : 30));
    return [...source]
      .map((point) => ({
        day: point.day,
        terjual: point.terjual,
        tersisa: point.tersisa,
        revenue: point.terjual * AVG_PRICE_PER_PORSI,
      }))
      .reverse();
  }, [period]);

  if (!hydrated) {
    return (
      <Card>
        <div className="h-6 w-40 animate-pulse rounded-lg bg-cream-100" />
        <div className="mt-4">
          <CardLinesSkeleton />
        </div>
      </Card>
    );
  }

  if (!plan.detailedReport) {
    return (
      <LockedFeatureCard
        title="Laporan Rinci Penjualan"
        description="Laporan harian per porsi beserta estimasi pendapatan per hari."
        requiredPlanLabel="Standar"
      />
    );
  }

  if (!hasOrders) {
    return (
      <Card>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
              Laporan Rinci · {period.replace('-', ' ')}
            </p>
            <h3 className="mt-1 flex items-center gap-1.5 font-display text-lg font-medium tracking-tight text-forest-900">
              <FileText className="h-4 w-4" />
              Penjualan Harian
            </h3>
          </div>
          <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal-900">
            Paket {plan.label}
          </span>
        </div>
        <div className="mt-4">
          <SalesEmptyState
            title="Laporan belum tersedia"
            description="Rincian penjualan harian akan terisi otomatis setelah ada pesanan yang masuk ke tokomu."
          />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Laporan Rinci · {period.replace('-', ' ')}
          </p>
          <h3 className="mt-1 flex items-center gap-1.5 font-display text-lg font-medium tracking-tight text-forest-900">
            <FileText className="h-4 w-4" />
            Penjualan Harian
          </h3>
        </div>
        <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal-900">
          Paket {plan.label}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-sage-100">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-50 text-[10px] font-bold uppercase tracking-[0.12em] text-sage-500">
            <tr>
              <th scope="col" className="px-4 py-2.5">Hari</th>
              <th scope="col" className="px-4 py-2.5 text-right">Terjual</th>
              <th scope="col" className="px-4 py-2.5 text-right">Tersisa</th>
              <th scope="col" className="px-4 py-2.5 text-right">Pendapatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-100">
            {rows.map((row) => (
              <tr key={`${period}-${row.day}`} className="text-charcoal-900">
                <th scope="row" className="px-4 py-2.5 font-semibold">{row.day}</th>
                <td className="px-4 py-2.5 text-right tabular-nums">{row.terjual}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-sage-500">{row.tersisa}</td>
                <td className="px-4 py-2.5 text-right font-semibold tabular-nums">
                  {formatRupiah(row.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
