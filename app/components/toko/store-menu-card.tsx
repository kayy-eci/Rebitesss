'use client';

import { useState } from 'react';
import { Check, Clock, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/app/components/Badge';
import { SmartImage } from '@/app/components/SmartImage';
import { formatRupiah } from '@/lib/data';
import type { StoreMenu } from './types';

export function StoreMenuCard({ menu }: { menu: StoreMenu }) {
  const [added, setAdded] = useState(false);
  const percent = Math.round((1 - menu.surplusPrice / menu.normalPrice) * 100);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/15">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
        <SmartImage
          src={menu.image}
          alt={`Foto ${menu.name}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="green">SURPLUS</Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant="gold">{percent}% OFF</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-sans text-base font-bold leading-snug text-charcoal-900">
            {menu.name}
          </h3>
          <p className="mt-0.5 text-sm text-charcoal-500">{menu.category}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-charcoal-500">
          <span className="flex items-center gap-1 font-medium">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {menu.rating.toFixed(1)}
          </span>
          <span>{menu.stock} porsi tersisa</span>
        </div>

        <p className="flex items-center gap-1 text-xs text-charcoal-500">
          <Clock className="h-3.5 w-3.5 text-green-700" />
          Tersedia {menu.availableFrom}–{menu.availableTo}
        </p>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm text-charcoal-500 line-through">
            {formatRupiah(menu.normalPrice)}
          </span>
          <span className="text-lg font-bold text-green-700">
            {formatRupiah(menu.surplusPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setAdded((v) => !v)}
          aria-pressed={added}
          className={cn(
            'mt-1 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
            added
              ? 'bg-sage-100 text-charcoal-900'
              : 'bg-green-700 text-white shadow-md shadow-green-700/20 hover:bg-green-600'
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Di Keranjang
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Keranjang
            </>
          )}
        </button>
      </div>
    </article>
  );
}
