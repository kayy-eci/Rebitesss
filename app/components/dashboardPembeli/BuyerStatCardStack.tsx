'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { useCountUp } from './useCountUp';
import { buyerStats } from './data';
import { formatRupiah } from '@/lib/data';
import type { BuyerStat } from './types';

function StatCard({ stat }: { stat: BuyerStat }) {
  const { ref, value } = useCountUp(stat.value);
  const isMoney = stat.label.includes('Belanja') || stat.label.includes('Hemat');
  const isUp = stat.changeDirection === 'up';

  return (
    <Card className="flex-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-500">
        {stat.label}
      </p>
      <p className="mt-2 truncate font-display text-[26px] font-medium leading-none tracking-tight text-forest-900">
        <span ref={ref}>{isMoney ? formatRupiah(value) : `${value} porsi`}</span>
      </p>
      <p
        className={cn(
          'mt-2 inline-flex items-center gap-1 text-xs font-semibold',
          isUp ? 'text-green-700' : 'text-charcoal-500'
        )}
      >
        {isUp ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" />
        )}
        {isUp ? '+' : ''}
        {stat.changePercent}%
        <span className="font-normal text-sage-500">dari bulan lalu</span>
      </p>
    </Card>
  );
}

export function BuyerStatCardStack() {
  return (
    <div className="flex h-full flex-col gap-4" aria-label="Ringkasan statistik pembelanjaan">
      {buyerStats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
