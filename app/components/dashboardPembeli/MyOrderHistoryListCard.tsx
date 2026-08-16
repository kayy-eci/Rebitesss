'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { FilterDropdown } from './FilterDropdown';
import { orderHistory, orderPeriodOptions } from './data';
import { formatRupiah } from '@/lib/data';
import { SmartImage } from '@/app/components/SmartImage';
import type { OrderStatus } from './types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  selesai: 'Selesai',
  'menunggu-diambil': 'Menunggu Diambil',
  dibatalkan: 'Dibatalkan',
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  selesai: 'bg-green-700 text-white',
  'menunggu-diambil': 'bg-sage-100 text-charcoal-900',
  dibatalkan: 'bg-charcoal-500 text-cream-50',
};

export function MyOrderHistoryListCard() {
  const [period, setPeriod] = useState('7-hari');

  const filtered = period === '7-hari' ? orderHistory.slice(0, 7) : orderHistory;

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">Riwayat Pesanan Saya</h2>
        <FilterDropdown
          value={period}
          onChange={setPeriod}
          options={orderPeriodOptions}
          ariaLabel="Filter riwayat pesanan berdasarkan waktu"
        />
      </div>

      <ul
        className="mt-3 max-h-[600px] divide-y divide-sage-100/60 overflow-y-auto pr-1"
        aria-label="Riwayat pesanan"
      >
        {filtered.map((order) => (
          <li key={order.id} className="flex items-center gap-3 py-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-sage-100">
              <SmartImage src={order.vendorAvatar} alt={`Logo ${order.vendorName}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-charcoal-900">{order.vendorName}</p>
              <p className="truncate text-xs text-sage-500">{order.productLabel}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-sage-500">{order.date}</p>
              <p className="mt-0.5 text-sm font-semibold text-charcoal-900">
                {formatRupiah(order.amount)}
              </p>
              <span
                className={cn(
                  'mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                  STATUS_CLASSES[order.status]
                )}
              >
                {STATUS_LABELS[order.status]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
