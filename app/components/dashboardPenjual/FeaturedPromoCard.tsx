'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { LockedFeatureCard } from './LockedFeatureCard';
import { useSellerPlan } from '@/lib/seller-plan';
import { patchSellerProduct } from '@/lib/product-storage';
import { useSellerProducts } from '@/hooks/use-seller-products';

/**
 * Promo Unggulan — eksklusif paket Max. Produk unggulan tampil lebih
 * dulu di halaman toko; toggle di sini menulis ke penyimpanan produk.
 */
export function FeaturedPromoCard() {
  const { plan } = useSellerPlan();
  const { products } = useSellerProducts();

  if (!plan.featuredPromo) {
    return (
      <LockedFeatureCard
        title="Promo Unggulan"
        description="Tandai satu menu sebagai Unggulan agar selalu tampil paling atas di halaman tokomu."
        requiredPlanLabel="Max"
      />
    );
  }

  const handleToggle = (id: string, next: boolean) => {
    patchSellerProduct(id, { featured: next });
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Promo Toko
          </p>
          <h3 className="mt-1 flex items-center gap-1.5 font-display text-lg font-medium tracking-tight text-forest-900">
            <Star className="h-4 w-4 text-gold-500" />
            Menu Unggulan
          </h3>
        </div>
        <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal-900">
          Paket Max
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {products.slice(0, 6).map((product) => (
          <li key={product.id}>
            <button
              type="button"
              aria-pressed={product.featured}
              onClick={() => handleToggle(product.id, !product.featured)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                product.featured
                  ? 'border-gold-300 bg-gold-100/60'
                  : 'border-sage-100 bg-white hover:border-green-700'
              )}
            >
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-50">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-charcoal-900">
                  {product.name}
                </span>
                <span className="block text-[11px] text-sage-500">
                  {product.featured ? 'Unggulan · tampil paling atas' : 'Menu reguler'}
                </span>
              </span>
              <Star
                className={cn(
                  'h-4 w-4 shrink-0',
                  product.featured ? 'fill-gold-500 text-gold-500' : 'text-sage-500'
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-sage-500">
        Menu unggulan otomatis diprioritaskan di halaman tokomu.
      </p>
    </Card>
  );
}
