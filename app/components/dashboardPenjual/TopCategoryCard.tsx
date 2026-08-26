'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Card } from './Card';
import { FilterDropdown } from './FilterDropdown';
import { LockedFeatureCard } from './LockedFeatureCard';
import { SalesEmptyState } from './SalesEmptyState';
import { useCountUp } from './useCountUp';
import { monthOptions, topCategoriesByMonth } from './data';
import { formatRupiah } from '@/lib/data';
import { useSellerPlan } from '@/lib/seller-plan';
import { useSellerOrders } from '@/hooks/use-seller-orders';

const SEGMENT_COLORS = ['#0F2E1F', '#1B4D32', '#2D6A4F', '#6B9080', '#E4EBE4', '#EAE0C8'];

function useLockedMonths(): string[] {
  const { plan } = useSellerPlan();

  return useMemo(() => {
    if (plan.historyDays === null) return [];

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 1);
    cutoff.setDate(0);
    const limitMs = Date.now() - plan.historyDays * 24 * 60 * 60 * 1000;

    return monthOptions
      .filter((option) => {

        const [year, month] = option.value.split('-').map(Number);
        const monthStart = new Date(year, month - 1, 1).getTime();
        const isCurrentMonth =
          new Date().getFullYear() === year && new Date().getMonth() === month - 1;
        return !isCurrentMonth && monthStart < limitMs;
      })
      .map((option) => option.value);
  }, [plan.historyDays]);
}

export function TopCategoryCard() {
  const { plan, hydrated } = useSellerPlan();
  const { hasOrders } = useSellerOrders();
  const lockedMonths = useLockedMonths();
  const firstOpenMonth =
    monthOptions.find((option) => !lockedMonths.includes(option.value))?.value ??
    monthOptions[0].value;

  const [month, setMonth] = useState(firstOpenMonth);
  const activeMonth = lockedMonths.includes(month) ? firstOpenMonth : month;
  const data = topCategoriesByMonth[activeMonth];
  const isLocked = lockedMonths.includes(month);
  const { ref, value } = useCountUp(data.total);

  if (!hydrated) {
    return (
      <Card>
        <div className="h-9 w-44 animate-pulse rounded-lg bg-cream-100" />
        <div className="mt-5 h-3 w-full animate-pulse rounded-full bg-cream-100" />
        <div className="mt-4 space-y-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded-full bg-cream-100" />
          ))}
        </div>
      </Card>
    );
  }

  if (!plan.categoryPerformance) {
    return (
      <LockedFeatureCard
        title="Kategori Terlaris"
        description="Lihat rincian penjualan per kategori untuk menemukan menu andalan tokomu. Fitur ini terbuka setelah upgrade ke paket berbayar."
        requiredPlanLabel="Standar"
        ctaLabel="Upgrade Sekarang"
        ctaHref="/dashboard/penjual/langganan"
      />
    );
  }

  if (!hasOrders) {
    return (
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-display text-[28px] font-medium leading-none tracking-tight text-forest-900">
              Rp0
            </p>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-500">
              Kategori Terlaris
            </p>
          </div>
        </div>
        <div className="mt-4">
          <SalesEmptyState
            title="Belum ada data kategori"
            description="Rincian penjualan per kategori akan muncul otomatis setelah ada pesanan yang masuk ke tokomu."
          />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display text-[28px] font-medium leading-none tracking-tight text-forest-900">
            <span ref={ref}>{formatRupiah(value)}</span>
          </p>
          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-500">
            Kategori Terlaris
          </p>
        </div>
        <FilterDropdown
          value={month}
          onChange={setMonth}
          options={monthOptions}
          ariaLabel="Pilih bulan untuk kategori terlaris"
        />
      </div>

      {isLocked ? (
        <div className="mt-5 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-sage-100 bg-cream-50/70 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-charcoal-500">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-charcoal-900">
              Riwayat di luar 30 hari terkunci
            </p>
            <p className="mt-1 text-xs leading-relaxed text-sage-500">
              Paket {plan.label} menyimpan riwayat penjualan {plan.historyDays} hari.
              Upgrade ke ReBites Standar untuk riwayat tanpa batas.
            </p>
          </div>
          <Link
            href="/langganan/pembayaran?plan=standar&billing=monthly"
            className="rounded-full bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
          >
            Upgrade ke ReBites Standar
          </Link>
        </div>
      ) : (
        <>
          <div
            className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-cream-100"
            role="img"
            aria-label="Persentase penjualan per kategori"
          >
            {data.categories.map((category, index) => (
              <div
                key={category.category}
                className="h-full"
                style={{
                  width: `${category.percent}%`,
                  backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                }}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-2">
            {data.categories.map((category, index) => (
              <li key={category.category} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2 font-medium text-charcoal-900">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                  />
                  {category.category}
                </span>
                <span className="font-semibold text-charcoal-900">{category.percent}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
