'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, ChevronDown, ChevronUp, ImagePlus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/app/components/SmartImage';
import { patchSellerProduct, type SellerProduct } from '@/lib/product-storage';
import { MENU_CATEGORIES } from './types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

const labelClass =
  'mb-1 block text-[10px] font-semibold uppercase tracking-wider text-charcoal-900';
const inputClass =
  'w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm text-charcoal-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20';

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold text-charcoal-900">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-green-600' : 'bg-sage-200'
        )}
      >
        <span
          className={cn(
            'absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-all',
            checked ? 'left-[1.25rem]' : 'left-0.5'
          )}
        />
      </button>
    </div>
  );
}

export function EditProductModal({
  product,
  open,
  onClose,
}: {
  product: SellerProduct | null;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [normalPrice, setNormalPrice] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [allDay, setAllDay] = useState(false);
  const [isSurplusToday, setIsSurplusToday] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !product) return;
    setName(product.name);
    setImage(product.image);
    setCategory(product.category);
    setPrice(product.surplusPrice);
    setStock(product.stock);
    setDescription(product.description ?? '');
    setNormalPrice(product.originalPrice);
    setStartTime(product.startTime || '09:00');
    setEndTime(product.endTime || '17:00');
    setAllDay(product.allDay ?? false);
    setIsSurplusToday(product.isSurplusToday);
    setShowAdvanced(false);
    setError('');
  }, [open, product]);

  if (!product) return null;

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSave = () => {
    setError('');
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Nama menu tidak boleh kosong.');
      return;
    }
    if (!category) {
      setError('Kategori tidak boleh kosong.');
      return;
    }
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      setError('Harga harus berupa angka dan tidak boleh negatif.');
      return;
    }
    if (!Number.isFinite(normalPrice) || normalPrice < 0) {
      setError('Harga normal tidak boleh negatif.');
      return;
    }
    const nextStock = Math.max(0, Math.floor(stock) || 0);
    const discountPercent =
      normalPrice > 0
        ? Math.max(
            0,
            Math.round((1 - Math.max(0, price) / normalPrice) * 100)
          )
        : 0;
    patchSellerProduct(product.id, {
      name: trimmedName,
      image: image || '/foods/ikansayur.jpg',
      category,
      surplusPrice: Math.max(0, price),
      stock: nextStock,
      description,
      originalPrice: normalPrice,
      startTime,
      endTime,
      allDay,
      isSurplusToday,
      discountPercent,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        handle
        className="max-h-[88vh] max-w-md overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="font-display text-lg font-medium tracking-tight text-forest-900">
            Edit Menu
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-sage-500">
            Ubah informasi utama menu. Field lain tersedia di “Edit lebih lanjut”.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="edit-product-name" className={labelClass}>
              Nama Produk
            </label>
            <input
              id="edit-product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nama menu"
            />
          </div>

          <div>
            <span className={labelClass}>Foto Produk</span>
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-sage-100 bg-sage-100">
                {image ? (
                  <SmartImage src={image} alt={`Foto ${product.name}`} />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sage-500">
                    <Camera className="h-5 w-5" />
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border border-sage-200 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal-900 transition-colors hover:border-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Ganti Foto
                </button>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border border-sage-200 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFile}
            />
          </div>

          <div>
            <label htmlFor="edit-product-category" className={labelClass}>
              Kategori
            </label>
            <select
              id="edit-product-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={cn(inputClass, 'appearance-none')}
            >
              {MENU_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-product-price" className={labelClass}>
                Harga Jual (Rp)
              </label>
              <input
                id="edit-product-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={inputClass}
                min={0}
              />
            </div>
            <div>
              <label htmlFor="edit-product-stock" className={labelClass}>
                Stok (porsi)
              </label>
              <input
                id="edit-product-stock"
                type="number"
                value={stock}
                onChange={(e) =>
                  setStock(Math.max(0, Number(e.target.value)))
                }
                className={inputClass}
                min={0}
              />
            </div>
          </div>

          <div className="rounded-xl bg-cream-50 p-3">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              aria-expanded={showAdvanced}
              className="flex w-fit items-center gap-1.5 text-xs font-semibold text-green-700 transition-colors hover:text-green-600"
            >
              {showAdvanced ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              {showAdvanced ? 'Sembunyikan detail lanjutan' : 'Edit lebih lanjut'}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-4 rounded-lg border border-sage-100 bg-white p-3">
                <div>
                  <label htmlFor="edit-product-normalprice" className={labelClass}>
                    Harga Normal (Rp)
                  </label>
                  <input
                    id="edit-product-normalprice"
                    type="number"
                    value={normalPrice}
                    onChange={(e) => setNormalPrice(Number(e.target.value))}
                    className={inputClass}
                    min={0}
                  />
                  <p className="mt-1 text-[11px] text-sage-500">
                    Diskon otomatis dihitung dari harga normal vs harga jual.
                  </p>
                </div>

                <div>
                  <label htmlFor="edit-product-description" className={labelClass}>
                    Deskripsi
                  </label>
                  <textarea
                    id="edit-product-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={cn(inputClass, 'resize-none')}
                    placeholder="Deskripsi menu"
                  />
                </div>

                <ToggleSwitch
                  checked={allDay}
                  onChange={setAllDay}
                  label="Tersedia sepanjang hari"
                />

                {!allDay && (
                  <div>
                    <span className={labelClass}>Jam Jual</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="h-9 flex-1 rounded-lg border border-sage-200 bg-white px-2 text-sm text-charcoal-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                      />
                      <span className="text-xs text-sage-500">–</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="h-9 flex-1 rounded-lg border border-sage-200 bg-white px-2 text-sm text-charcoal-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                      />
                    </div>
                  </div>
                )}

                <ToggleSwitch
                  checked={isSurplusToday}
                  onChange={setIsSurplusToday}
                  label="Tandai sebagai surplus hari ini"
                />
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-sage-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center whitespace-nowrap rounded-full border border-sage-200 bg-white px-4 py-2 text-xs font-semibold text-charcoal-900 transition-colors hover:bg-sage-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center whitespace-nowrap rounded-full bg-green-700 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
          >
            Simpan Perubahan
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
