'use client';

import { MoreVertical } from 'lucide-react';
import { Card } from './Card';
import { formatRupiah } from '@/lib/data';
import { SmartImage } from '@/app/components/SmartImage';
import { useSellerBestSellingMenus } from '@/hooks/use-seller-best-selling';

const MAX_ITEMS = 5;

export function BestSellingMenuRow() {
  const { menus } = useSellerBestSellingMenus();
  const topMenus = menus.slice(0, MAX_ITEMS);

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">Menu Terlaris</h2>
        <button
          type="button"
          aria-label="Menu lainnya"
          className="flex h-8 w-8 items-center justify-center rounded-full text-sage-500 transition-colors hover:bg-sage-100 hover:text-charcoal-900"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {topMenus.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-sage-100 bg-cream-50/70 p-6 text-center text-xs leading-relaxed text-sage-500">
          Belum ada menu untuk diperingkat. Tambahkan menu di halaman Menu Saya.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap items-start gap-x-3 gap-y-4">
          {topMenus.map((menu) => (
            <div
              key={menu.menuId}
              className="group relative flex flex-col items-center gap-1.5"
              aria-label={`${menu.name} · ${menu.terjual} terjual`}
            >
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-charcoal-900 px-2 py-1 text-[11px] font-medium text-cream-50 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                {menu.name} · {menu.terjual} terjual
              </span>
              <span className="relative block h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-sage-100 transition-transform duration-150 group-hover:scale-105">
                <SmartImage src={menu.image} alt={`Foto ${menu.name}`} />
              </span>
              <span className="max-w-[64px] truncate text-[10px] font-semibold text-charcoal-900">
                {formatRupiah(menu.surplusPrice)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
