'use client';

import { Clock, Leaf, Star } from 'lucide-react';
import { Card } from '@/app/components/dashboardPenjual/Card';
import { SmartImage } from '@/app/components/SmartImage';
import type { MenuFormState } from './types';

const formatPrice = (value: number) => value.toLocaleString('id-ID');

export function MenuPreviewCard({ form }: { form: MenuFormState }) {
  const percent =
    form.normalPrice > form.surplusPrice && form.normalPrice > 0
      ? Math.round((1 - form.surplusPrice / form.normalPrice) * 100)
      : 0;

  return (
    <Card className="lg:sticky lg:top-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-500">
        Pratinjau Menu
      </p>

      <div className="relative mt-3 h-44 overflow-hidden rounded-2xl border border-sage-100">
        <SmartImage src={form.photo} alt="Foto menu" />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          Surplus
        </span>
        {percent > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-cream-50 px-2.5 py-1 text-[10px] font-bold text-charcoal-900 shadow-sm">
            Hemat {percent}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="font-display text-xl font-medium leading-snug tracking-tight text-primary">
          {form.name.trim() || 'Nama Menu'}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-sage-500">
          <span className="rounded-full bg-sage-100 px-2 py-0.5 font-medium text-charcoal-900">
            {form.category}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current text-primary" />
            Baru
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-3xl font-semibold leading-none tracking-tight text-primary">
            Rp{formatPrice(form.surplusPrice)}
          </p>
          {form.normalPrice > form.surplusPrice && (
            <p className="text-sm font-medium text-sage-500 line-through">
              Rp{formatPrice(form.normalPrice)}
            </p>
          )}
        </div>
        <p className="mt-1 text-[11px] text-sage-500">
          Harga normal Rp{formatPrice(form.normalPrice)} · {form.stock} porsi tersedia
        </p>
      </div>

      <div className="mt-4 space-y-2.5 border-t border-sage-100 pt-4 text-xs text-charcoal-900">
        <p className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 shrink-0 text-sage-500" />
          Tersedia pukul {form.startTime}–{form.endTime}
        </p>
        <p className="flex items-center gap-2.5">
          <Leaf className="h-4 w-4 shrink-0 text-sage-500" />
          {form.stock} porsi selamat dari terbuang
        </p>
      </div>

      {!form.isSurplusToday && (
        <p className="mt-4 rounded-xl bg-cream-100 px-3 py-2.5 text-[11px] leading-relaxed text-charcoal-500">
          Menu belum ditandai sebagai surplus. Aktifkan “Tampilkan hari ini” agar pembeli bisa
          langsung menemukannya.
        </p>
      )}
    </Card>
  );
}
