'use client';

import { useState } from 'react';
import { Card } from './Card';
import { FilterDropdown } from './FilterDropdown';
import { useCountUp } from './useCountUp';
import { monthOptions, topCategoriesByMonth } from './data';
import { formatRupiah } from '@/lib/data';

const SEGMENT_COLORS = ['#0F2E1F', '#1B4D32', '#2D6A4F', '#6B9080', '#E4EBE4', '#EAE0C8'];

export function TopCategoryCard() {
  const [month, setMonth] = useState('2026-08');
  const data = topCategoriesByMonth[month];
  const { ref, value } = useCountUp(data.total);

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
    </Card>
  );
}
