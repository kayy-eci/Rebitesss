'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, Coins } from 'lucide-react';
import { SmartImage } from '@/app/components/SmartImage';
import { formatRupiah } from '@/lib/data';
import { fetchProductDetail } from '@/app/detail/product/detail-data';
import type { StoredOrder } from '@/lib/types';
import { formatOrderDate } from '@/lib/order-utils';
import { toast } from '@/hooks/use-toast';

export function OrderCard({
  order,
  reviewed,
  onViewDetail,
}: {
  order: StoredOrder;
  reviewed: boolean;
  onViewDetail: (order: StoredOrder) => void;
}) {
  const router = useRouter();
  const [reordering] = useState(false);
  const isOngoing = order.status === 'ongoing';

  // For photo-style: show dot + In progress / Delivered
  const badge = isOngoing
    ? { label: 'In progress', dot: 'bg-[#EA580C]', bg: 'bg-[#FFF7ED] text-[#EA580C]', ring: 'ring-[#FDBA74]/30' }
    : { label: 'Delivered', dot: 'bg-[#16A34A]', bg: 'bg-[#F0FDF4] text-[#16A34A]', ring: 'ring-[#86EFAC]/30' };

  const dateStr = formatOrderDate(order.createdAt);

  // Build description like photo: productName | vendorName | & 2 more items (if quantity >1)
  const moreText = order.quantity > 1 ? ` & ${order.quantity} items` : '';
  // Combine to look like "Blue & pink ... | Linen ... & 2 more items"
  const description = `${order.productName} | ${order.vendorName}${moreText}`;

  return (
    <article
      onClick={() => onViewDetail(order)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetail(order);
        }
      }}
      className="group flex cursor-pointer flex-col rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 sm:p-5"
    >
      {/* Top line: badge + date */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${badge.bg} ${badge.ring}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
        <span className="text-[11px] text-zinc-400">|</span>
        <span className="text-[11px] text-zinc-500">{dateStr}</span>
      </div>

      {/* Middle: image + order id + desc + price + chevron */}
      <div className="mt-3 flex items-start gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
          <SmartImage src={order.image} alt={order.productName} sizes="56px" />
          {/* small badge +4 like foto if needed - hidden */}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[#7A1C1C]">
            Order ID: {order.orderId}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-zinc-700">
            {description}
            {/* 2 more items in maroon like foto if quantity >1 */}
            {order.quantity > 1 && (
              <span className="font-medium text-[#7A1C1C]"> & {order.quantity} items</span>
            )}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-zinc-900">Rp{order.total.toLocaleString('id-ID')}</p>
        </div>

        <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-[#7A1C1C] transition-transform group-hover:translate-x-0.5" />
      </div>
    </article>
  );
}
