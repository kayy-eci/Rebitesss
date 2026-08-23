'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OrderTab = 'active' | 'completed';
export type FulfillmentFilter = 'all' | 'delivery' | 'pickup';

/**
 * Toolbar Pesanan Saya — sederhana dan relevan hanya dengan transaksi:
 * tab status (dengan jumlah aktual), pencarian order, dan filter
 * Semua / Pickup / Delivery.
 */
export function OrderToolbar({
  tab,
  onTabChange,
  activeCount,
  completedCount,
  query,
  onQueryChange,
  fulfillment,
  onFulfillmentChange,
}: {
  tab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  activeCount: number;
  completedCount: number;
  query: string;
  onQueryChange: (q: string) => void;
  fulfillment: FulfillmentFilter;
  onFulfillmentChange: (f: FulfillmentFilter) => void;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
        {/* Tabs — jumlah dari data aktual */}
        <div className="grid w-full grid-cols-2 gap-1 rounded-full border border-hairline bg-cream-100 p-1 sm:inline-grid sm:w-auto sm:grid-cols-none">
          <TabButton
            label="Sedang Berlangsung"
            count={activeCount}
            active={tab === 'active'}
            onClick={() => onTabChange('active')}
          />
          <TabButton
            label="Selesai"
            count={completedCount}
            active={tab === 'completed'}
            onClick={() => onTabChange('completed')}
          />
        </div>

        {/* Filter fulfillment — hanya yang berhubungan dengan transaksi */}
        <div className="flex flex-wrap items-center gap-1.5 lg:ml-4">
          {(
            [
              { key: 'all', label: 'Semua' },
              { key: 'delivery', label: 'Delivery' },
              { key: 'pickup', label: 'Pickup' },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => onFulfillmentChange(f.key)}
              className={cn(
                'h-9 rounded-full px-3.5 text-xs font-semibold transition-all duration-200',
                fulfillment === f.key
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'bg-white text-charcoal-500 ring-1 ring-hairline hover:text-green-700 hover:ring-sage-500/50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search — hanya bekerja pada riwayat pesanan */}
      <label className="relative w-full">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari pesanan atau nama toko..."
          className="h-11 w-full rounded-xl border border-hairline bg-white pl-10 pr-4 text-sm text-charcoal-900 placeholder:text-charcoal-500/60 outline-none transition-all focus:border-sage-500 focus:ring-4 focus:ring-green-50"
        />
      </label>
    </div>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200',
        active
          ? 'bg-green-700 text-white shadow-sm'
          : 'text-charcoal-500 hover:bg-white hover:text-green-700'
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 py-px text-[10px] tabular-nums',
          active ? 'bg-white/20 text-white' : 'bg-cream-100 text-charcoal-500'
        )}
      >
        {count}
      </span>
    </button>
  );
}
