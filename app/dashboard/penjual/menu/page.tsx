'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Crown,
  Lock,
  Minus,
  Package,
  Pencil,
  Plus,
  Trash2,
  Utensils,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/data';
import { patchSellerProduct, deleteSellerProduct } from '@/lib/product-storage';
import { isProductAvailable } from '@/lib/product-storage';
import { useSellerPlan } from '@/lib/seller-plan';
import { useSellerProducts } from '@/hooks/use-seller-products';
import type { SellerProduct } from '@/lib/product-storage';
import { MENU_CATEGORIES } from '@/app/components/tambahMenu/types';
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

function StockEditor({ product }: { product: SellerProduct }) {
  const [stock, setStock] = useState(product.stock);
  const [editing, setEditing] = useState(false);

  const handleSave = (newStock: number) => {
    const clamped = Math.max(0, newStock);
    setStock(clamped);
    patchSellerProduct(product.id, { stock: clamped });
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Package className="h-3.5 w-3.5 text-sage-500" />
      <span className="text-xs text-charcoal-500">Stok:</span>
      {editing ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleSave(Math.max(0, stock - 1))}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-sage-200 bg-white text-charcoal-700 transition-colors hover:bg-sage-50"
          >
            <Minus className="h-3 w-3" />
          </button>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
            onBlur={() => handleSave(stock)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave(stock)}
            className="h-7 w-14 rounded-md border border-green-600 bg-white px-2 text-center text-xs font-bold text-charcoal-900 outline-none ring-2 ring-green-600/20"
            min={0}
            autoFocus
          />
          <button
            type="button"
            onClick={() => handleSave(stock + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-sage-200 bg-white text-charcoal-700 transition-colors hover:bg-sage-50"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors',
            stock > 0
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          )}
        >
          {stock > 0 ? `${stock} porsi` : 'Habis'}
        </button>
      )}
    </div>
  );
}

function TimeEditor({ product }: { product: SellerProduct }) {
  const [startTime, setStartTime] = useState(product.startTime || '09:00');
  const [endTime, setEndTime] = useState(product.endTime || '17:00');
  const [allDay, setAllDay] = useState(product.allDay ?? false);

  const handleAllDayToggle = () => {
    const next = !allDay;
    setAllDay(next);
    patchSellerProduct(product.id, { allDay: next });
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    if (field === 'startTime') {
      setStartTime(value);
      patchSellerProduct(product.id, { startTime: value });
    } else {
      setEndTime(value);
      patchSellerProduct(product.id, { endTime: value });
    }
  };

  const available = isProductAvailable(product);

  return (
    <div className="space-y-2">
      {/* All-day toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-sage-500" />
          <span className="text-xs text-charcoal-500">Jam jual:</span>
        </div>
        <button
          type="button"
          onClick={handleAllDayToggle}
          className={cn(
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
            allDay ? 'bg-green-600' : 'bg-sage-200'
          )}
        >
          <span
            className={cn(
              'absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-all',
              allDay ? 'left-4.5' : 'left-0.5'
            )}
          />
        </button>
      </div>

      {/* Time pickers */}
      {!allDay && (
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={startTime}
            onChange={(e) => handleTimeChange('startTime', e.target.value)}
            className="h-7 flex-1 rounded-md border border-sage-200 bg-white px-2 text-xs text-charcoal-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
          <span className="text-xs text-sage-500">–</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => handleTimeChange('endTime', e.target.value)}
            className="h-7 flex-1 rounded-md border border-sage-200 bg-white px-2 text-xs text-charcoal-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      )}

      {/* Status indicator */}
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
          available
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-600'
        )}
      >
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            available ? 'bg-green-500' : 'bg-red-500'
          )}
        />
        {available
          ? allDay
            ? 'Tersedia Sepanjang Hari'
            : 'Sedia Sekarang'
          : product.stock <= 0
          ? 'Stok Habis'
          : 'Di Luar Jam Jual'}
      </div>
    </div>
  );
}

function MenuCard({ product }: { product: SellerProduct }) {
  const { plan } = useSellerPlan();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [editCategory, setEditCategory] = useState(product.category);
  const [editPrice, setEditPrice] = useState(product.surplusPrice);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  const startEdit = () => {
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(product.surplusPrice);
    setEditError('');
    setEditSuccess(false);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(product.surplusPrice);
    setEditError('');
    setEditing(false);
  };

  const saveEdit = () => {
    setEditError('');
    const name = editName.trim();
    if (!name) {
      setEditError('Nama menu tidak boleh kosong.');
      return;
    }
    if (!editCategory) {
      setEditError('Kategori tidak boleh kosong.');
      return;
    }
    if (typeof editPrice !== 'number' || editPrice < 0) {
      setEditError('Harga harus berupa angka dan tidak boleh negatif.');
      return;
    }
    const discountPercent =
      product.originalPrice > 0
        ? Math.max(
            0,
            Math.round((1 - editPrice / product.originalPrice) * 100)
          )
        : 0;
    patchSellerProduct(product.id, {
      name,
      category: editCategory,
      surplusPrice: editPrice,
      discountPercent,
    });
    setEditing(false);
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 2500);
  };

  const handleToggleFeatured = () => {
    patchSellerProduct(product.id, { featured: !product.featured });
  };

  const handleToggleStock = () => {
    patchSellerProduct(product.id, {
      stock: product.stock > 0 ? 0 : 5,
    });
  };

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    deleteSellerProduct(product.id);
  };

  const available = isProductAvailable(product);

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
            available
              ? 'bg-white/95 text-green-700'
              : 'bg-white/95 text-charcoal-500'
          )}
        >
          {available ? `Stok ${product.stock}` : product.stock <= 0 ? 'Habis' : 'Tutup'}
        </span>
      </div>

      {editing ? (
        <div className="mt-3 space-y-3">
          {/* Nama */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-charcoal-900">
              Nama Menu
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm text-charcoal-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              placeholder="Nama menu"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-charcoal-900">
              Kategori
            </label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm text-charcoal-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            >
              {MENU_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Harga */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-charcoal-900">
              Harga Jual (Rp)
            </label>
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
              className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm text-charcoal-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              min={0}
            />
          </div>

          {/* Error / Success feedback */}
          {editError && (
            <p className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-600">
              <XCircle className="h-3.5 w-3.5 shrink-0" />
              {editError}
            </p>
          )}
          {editSuccess && (
            <p className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1.5 text-[11px] font-medium text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Berhasil disimpan!
            </p>
          )}

          {/* Tombol Simpan & Batal */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveEdit}
              className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-green-700/20 transition-colors hover:bg-green-600"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Simpan
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-white px-4 py-2 text-xs font-semibold text-charcoal-900 transition-colors hover:bg-sage-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              Batal
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-charcoal-900">
                {product.name}
              </h3>
              <p className="mt-0.5 text-xs text-sage-500">{product.category}</p>
            </div>
            <button
              type="button"
              onClick={startEdit}
              aria-label={`Edit ${product.name}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sage-200 text-charcoal-500 transition-colors hover:border-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-bold text-green-700">
              {formatRupiah(product.surplusPrice)}
            </span>
            <span className="text-xs text-charcoal-500 line-through">
              {formatRupiah(product.originalPrice)}
            </span>
          </div>

          {editSuccess && !editing && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1.5 text-[11px] font-medium text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Perubahan tersimpan
            </p>
          )}
        </>
      )}

      {/* Stock editor */}
      <div className="mt-3">
        <StockEditor product={product} />
      </div>

      {/* Time scheduler */}
      <div className="mt-3">
        <TimeEditor product={product} />
      </div>

      {/* Action buttons */}
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
          Kelola menu surplus, stok, dan jam penjualan.
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
