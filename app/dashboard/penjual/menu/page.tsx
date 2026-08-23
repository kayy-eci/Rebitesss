'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Crown,
  Lock,
  Plus,
  Trash2,
  Utensils,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/data';
import { patchSellerProduct, deleteSellerProduct } from '@/lib/product-storage';
import { useSellerPlan } from '@/lib/seller-plan';
import { useSellerProducts } from '@/hooks/use-seller-products';
import type { SellerProduct } from '@/lib/product-storage';
import { SellerShell } from '@/app/components/dashboardPenjual/SellerShell';
import { Card } from '@/app/components/dashboardPenjual/Card';
import { SmartImage } from '@/app/components/SmartImage';

function ProductLimitMeter() {
  const { plan } = useSellerPlan();
  const { products } = useSellerProducts();
  const count = products.length;
  const max = plan.maxProducts;
  const isUnlimited = max === null;
  const percent = isUnlimited ? 0 : Math.min(100, (count / max) * 100);
  const isFull = !isUnlimited && count >= max;

  return (
    <div className="mt-5 rounded-2xl bg-cream-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-charcoal-900">
          Kuota produk{' '}
          <span className="text-sage-500">· paket {plan.label}</span>
        </p>
        <p
          className={cn(
            'text-xs font-bold',
            isFull ? 'text-caramel-dark' : 'text-green-700'
          )}
        >
          {isUnlimited ? `${count} produk · tanpa batas` : `${count}/${max} produk`}
        </p>
      </div>
      {!isUnlimited && (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isFull ? 'bg-gold-500' : 'bg-green-700'
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
      {plan.tier === 'basic' && (
        <p className="mt-2 text-[11px] leading-relaxed text-sage-500">
          Paket Basic menyimpan maksimal {max} produk dan riwayat penjualan 30 hari.
        </p>
      )}
    </div>
  );
}

function MenuCard({ product }: { product: SellerProduct }) {
  const { plan } = useSellerPlan();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleToggleStock = () => {
    patchSellerProduct(product.id, {
      stock: product.stock > 0 ? 0 : Math.max(product.stock, 5),
    });
  };

  const handleToggleFeatured = () => {
    patchSellerProduct(product.id, { featured: !product.featured });
  };

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    deleteSellerProduct(product.id);
  };

  return (
    <Card className="flex flex-col p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sage-100">
        <SmartImage src={product.image} alt={`Foto ${product.name}`} />
        {product.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-md">
            <Crown className="h-3 w-3" />
            Unggulan
          </span>
        )}
        <span
          className={cn(
            'absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]',
            product.stock > 0
              ? 'bg-white/95 text-green-700'
              : 'bg-white/95 text-charcoal-500'
          )}
        >
          {product.stock > 0 ? `Stok ${product.stock}` : 'Habis'}
        </span>
      </div>

      <h3 className="mt-3 truncate text-sm font-bold text-charcoal-900">
        {product.name}
      </h3>
      <p className="mt-0.5 text-xs text-sage-500">{product.category}</p>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-sm font-bold text-green-700">
          {formatRupiah(product.surplusPrice)}
        </span>
        <span className="text-xs text-charcoal-500 line-through">
          {formatRupiah(product.originalPrice)}
        </span>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <button
          type="button"
          onClick={handleToggleStock}
          className="rounded-full border border-sage-100 px-3 py-1.5 text-[11px] font-semibold text-charcoal-900 transition-colors hover:bg-cream-50"
        >
          {product.stock > 0 ? 'Set Habis' : 'Set Tersedia'}
        </button>

        {plan.featuredPromo && (
          <button
            type="button"
            onClick={handleToggleFeatured}
            className={cn(
              'rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors',
              product.featured
                ? 'bg-gold-500 text-white hover:bg-gold-600'
                : 'border border-gold-500 text-gold-600 hover:bg-gold-100'
            )}
          >
            {product.featured ? 'Lepas Unggulan' : 'Jadikan Unggulan'}
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          onBlur={() => setConfirmingDelete(false)}
          aria-label={confirmingDelete ? `Klik lagi untuk menghapus ${product.name}` : `Hapus ${product.name}`}
          className={cn(
            'ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors',
            confirmingDelete
              ? 'bg-red-600 text-white'
              : 'border border-sage-100 text-charcoal-500 hover:bg-cream-50 hover:text-charcoal-900'
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {confirmingDelete ? 'Yakin?' : 'Hapus'}
        </button>
      </div>
    </Card>
  );
}

export default function MenuSayaPage() {
  const { plan } = useSellerPlan();
  const { products } = useSellerProducts();

  const isLimitReached =
    plan.maxProducts !== null && products.length >= plan.maxProducts;

  return (
    <SellerShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
          Dashboard Penjual
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-forest-900">
          Menu Saya
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-sage-500">
          <Utensils className="h-3.5 w-3.5" />
          Kelola menu surplus yang ditawarkan ke pembeli.
        </p>
      </motion.div>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-charcoal-900">
            Daftar menu toko ({products.length})
          </p>
          {isLimitReached ? (
            plan.upgradeSlug && (
              <Link
                href={`/langganan/pembayaran?plan=${plan.upgradeSlug}&billing=monthly`}
                className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
              >
                <Lock className="h-3.5 w-3.5" />
                Naikkan kuota via upgrade
              </Link>
            )
          ) : (
            <Link
              href="/dashboard/penjual/tambahMenu"
              className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Menu
            </Link>
          )}
        </div>

        <ProductLimitMeter />

        {isLimitReached && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gold-100 px-3 py-2 text-[11px] font-medium text-charcoal-900">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-gold-600" />
            Batas produk tercapai ({products.length}/{plan.maxProducts}). Hapus salah satu
            menu atau upgrade paket untuk menambah lagi.
          </p>
        )}
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <MenuCard key={product.id} product={product} />
        ))}
      </div>
    </SellerShell>
  );
}
