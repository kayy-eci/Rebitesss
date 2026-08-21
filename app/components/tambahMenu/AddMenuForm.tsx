'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, Minus, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/app/components/dashboardPenjual/Card';
import { Reveal } from '@/app/components/reveal';
import { PhotoPicker } from './PhotoPicker';
import { MenuPreviewCard } from './MenuPreviewCard';
import { DEFAULT_MENU_FORM, MENU_CATEGORIES } from './types';
import type { MenuFormState } from './types';

const inputCls =
  'w-full rounded-xl border border-sage-100 bg-white px-4 py-3 text-sm text-charcoal-900 placeholder:text-sage-500 transition-colors focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20';
const labelCls =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-900';

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-[11px] font-bold text-charcoal-900">
        {number}
      </span>
      <h2 className="text-sm font-bold text-charcoal-900">{title}</h2>
    </div>
  );
}

function FieldError() {
  return (
    <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber/15 px-2.5 py-1.5 text-[11px] font-medium text-charcoal-900">
      <Info className="h-3.5 w-3.5 shrink-0 text-amber" />
      Nama menu wajib diisi sebelum disimpan
    </p>
  );
}

export function AddMenuForm() {
  const [form, setForm] = useState<MenuFormState>(DEFAULT_MENU_FORM);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedName, setSavedName] = useState('');

  const set = <K extends keyof MenuFormState>(key: K, value: MenuFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setTouched(true);
    if (!form.name.trim()) return;
    setSavedName(form.name.trim());
    setSaved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setForm(DEFAULT_MENU_FORM);
    setTouched(false);
    setSaved(false);
  };

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mx-auto mt-10 max-w-md"
      >
        <Card className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-cream-50 shadow-lg shadow-green-700/30"
          >
            <CheckCircle2 className="h-8 w-8" />
          </motion.div>
          <h2 className="mt-5 font-display text-2xl font-medium tracking-tight text-forest-900">
            Menu Berhasil Ditambahkan
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-sage-500">
            “{savedName}” telah masuk ke daftar menu tokomu dan siap dipesan pembeli.
          </p>
          <div className="mt-6 grid gap-3">
            <Link
              href="/dashboardPenjual"
              className="inline-flex w-full items-center justify-center rounded-full bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
            >
              Lihat Dashboard
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex w-full items-center justify-center rounded-full border border-sage-100 bg-white px-4 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-cream-50"
            >
              Tambah Menu Lagi
            </button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
      <Reveal className="lg:col-span-8">
        <Card>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
            className="space-y-8"
            noValidate
          >
            <section>
              <SectionTitle number="1" title="Foto Menu" />
              <PhotoPicker
                value={form.photo}
                onChange={(photo) => set('photo', photo)}
              />
            </section>

            <section>
              <SectionTitle number="2" title="Detail Menu" />
              <div className="space-y-4">
                <div>
                  <label htmlFor="menu-name" className={labelCls}>
                    Nama Menu
                  </label>
                  <input
                    id="menu-name"
                    type="text"
                    value={form.name}
                    onChange={(event) => set('name', event.target.value)}
                    placeholder="Contoh: Nasi Uduk Komplit"
                    className={inputCls}
                    autoComplete="off"
                  />
                  <AnimatePresence>
                    {touched && !form.name.trim() && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FieldError />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="menu-category" className={labelCls}>
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      id="menu-category"
                      value={form.category}
                      onChange={(event) => set('category', event.target.value)}
                      className={cn(inputCls, 'appearance-none pr-10')}
                    >
                      {MENU_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-sage-500">
                      ▼
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="menu-description" className={labelCls}>
                    Deskripsi
                  </label>
                  <textarea
                    id="menu-description"
                    rows={3}
                    value={form.description}
                    onChange={(event) => set('description', event.target.value)}
                    placeholder="Contoh: Nasi uduk hangat dengan ayam suwir, telur balado, dan sambal khas…"
                    className={cn(inputCls, 'resize-none')}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle number="3" title="Harga & Stok" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="menu-normal-price" className={labelCls}>
                    Harga Normal
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-sage-500">
                      Rp
                    </span>
                    <input
                      id="menu-normal-price"
                      type="number"
                      min={0}
                      value={form.normalPrice}
                      onChange={(event) => set('normalPrice', Number(event.target.value) || 0)}
                      className={cn(inputCls, 'pl-11')}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="menu-surplus-price" className={labelCls}>
                      Harga Surplus
                    </label>
                    {form.normalPrice > form.surplusPrice && form.normalPrice > 0 && (
                      <span className="mb-1.5 rounded-full bg-green-700 px-2 py-0.5 text-[10px] font-bold text-white">
                        Hemat{' '}
                        {Math.round((1 - form.surplusPrice / form.normalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-sage-500">
                      Rp
                    </span>
                    <input
                      id="menu-surplus-price"
                      type="number"
                      min={0}
                      value={form.surplusPrice}
                      onChange={(event) => set('surplusPrice', Number(event.target.value) || 0)}
                      className={cn(inputCls, 'pl-11')}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-sage-500">
                    Harga diskon untuk porsi surplus hari ini.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="menu-stock" className={labelCls}>
                  Porsi Tersedia
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Kurangi porsi"
                    onClick={() => set('stock', Math.max(0, form.stock - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-100 bg-cream-50 text-charcoal-900 transition-colors hover:bg-sage-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-display text-2xl font-medium leading-none text-forest-900">
                    {form.stock}
                  </span>
                  <button
                    type="button"
                    aria-label="Tambah porsi"
                    onClick={() => set('stock', form.stock + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-100 bg-cream-50 text-charcoal-900 transition-colors hover:bg-sage-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-sage-500">porsi</span>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle number="4" title="Ketersediaan" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="menu-start-time" className={labelCls}>
                    Jam Mulai
                  </label>
                  <input
                    id="menu-start-time"
                    type="time"
                    value={form.startTime}
                    onChange={(event) => set('startTime', event.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="menu-end-time" className={labelCls}>
                    Jam Selesai
                  </label>
                  <input
                    id="menu-end-time"
                    type="time"
                    value={form.endTime}
                    onChange={(event) => set('endTime', event.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-cream-50 px-4 py-3.5">
                <div>
                  <p className="text-xs font-semibold text-charcoal-900">
                    Tampilkan sebagai surplus hari ini
                  </p>
                  <p className="mt-0.5 text-[11px] text-sage-500">
                    Pembeli bisa langsung memesan menu ini hari ini
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isSurplusToday}
                  onClick={() => set('isSurplusToday', !form.isSurplusToday)}
                  className={cn(
                    'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                    form.isSurplusToday ? 'bg-green-700' : 'bg-sage-100'
                  )}
                >
                  <motion.span
                    animate={{ x: form.isSurplusToday ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-sage-100 pt-6 sm:flex-row sm:items-center">
              <Link
                href="/dashboardPenjual"
                className="inline-flex items-center justify-center rounded-full border border-sage-100 bg-white px-5 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-cream-50"
              >
                Batalkan
              </Link>
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
              >
                <Save className="h-4 w-4" />
                Simpan Menu
              </button>
            </div>

            <p className="flex items-center gap-1.5 text-[11px] text-sage-500">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Setelah disimpan, menu langsung tampil pada halaman menu tokomu dan berpotensi
              dipesan hari ini.
            </p>
          </form>
        </Card>
      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-4">
        <MenuPreviewCard form={form} />
      </Reveal>
    </div>
  );
}
