'use client';

import Link from 'next/link';
import { ArrowUpRight, Store } from 'lucide-react';
import { Card } from './Card';
import { QuickActionsRow } from './QuickActionsRow';
import { useCountUp } from './useCountUp';
import { vendorInfo } from './data';
import { DotPattern, LeafSprig } from './decor';
import { formatRupiah } from '@/lib/data';

export function StoreCard() {
  const { ref, value } = useCountUp(vendorInfo.withdrawableBalance);

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">Profil Toko</h2>
        <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal-900">
          {vendorInfo.partnerTier}
        </span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-green-600 p-6 text-cream-50 shadow-md shadow-forest-900/20">
        <DotPattern className="right-0 top-0 h-40 w-40 text-cream-50/10" />
        <LeafSprig className="-right-8 -top-6 h-44 w-44 text-cream-50/15" />

        <div className="relative flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-50/70">
              ReBites Partner
            </p>
            <p className="mt-2 inline-flex rounded-full bg-cream-50/15 px-2.5 py-1 text-[11px] font-semibold text-cream-50">
              {vendorInfo.storeName}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/15">
            <Store className="h-4 w-4 text-cream-50" />
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg font-medium leading-tight text-cream-50">
              {vendorInfo.ownerName}
            </p>
            <p className="mt-1 text-[11px] text-cream-50/60">
              Partner sejak {vendorInfo.partnerSince} · {vendorInfo.storeIdMasked}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cream-50/70">
              Bisa Dicairkan
            </p>
            <p className="mt-1 font-display text-2xl font-semibold leading-none text-cream-50">
              <span ref={ref}>{formatRupiah(value)}</span>
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/toko/dapur-ibu-tini"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-sage-100 bg-white px-4 py-2.5 text-xs font-semibold text-charcoal-900 transition-colors hover:bg-cream-50"
      >
        <Store className="h-3.5 w-3.5 text-green-700" />
        Lihat Profil Toko
        <ArrowUpRight className="h-3.5 w-3.5 text-sage-500" />
      </Link>

      <QuickActionsRow />
    </Card>
  );
}
