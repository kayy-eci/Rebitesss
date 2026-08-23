'use client';

import { useState } from 'react';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import type { AddressLabel, DeliveryAddress } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { AddressFormValues } from '@/hooks/use-addresses';
import { useCheckout } from './checkout-context';

const LABELS: AddressLabel[] = ['Rumah', 'Kos', 'Sekolah', 'Lainnya'];

const INPUT_CLASS =
  'w-full rounded-xl border border-sage-100 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-sage-500 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20';

function toFormValues(editing: DeliveryAddress | null): AddressFormValues {
  if (!editing) {
    return {
      label: 'Rumah',
      receiverName: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      fullAddress: '',
      note: '',
    };
  }
  return {
    label: editing.label,
    receiverName: editing.receiverName,
    phone: editing.phone,
    province: editing.province,
    city: editing.city,
    district: editing.district,
    fullAddress: editing.fullAddress,
    note: editing.note,
  };
}

/**
 * Tampilan form tambah/edit alamat — dirender DI DALAM popup alamat tunggal
 * (lihat delivery-address-section). Header & footer tetap terlihat;
 * hanya area tengah yang bisa di-scroll saat konten melebihi tinggi sheet.
 */
export function AddressFormView({
  editing,
  onDone,
}: {
  editing: DeliveryAddress | null;
  onDone: () => void;
}) {
  const { addAddress, updateAddress } = useCheckout();
  const [form, setForm] = useState<AddressFormValues>(() =>
    toFormValues(editing),
  );
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof AddressFormValues>(
    key: K,
    value: AddressFormValues[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.receiverName.trim()) return setError('Nama penerima wajib diisi.');
    if (!/^[0-9+\-\s]{9,16}$/.test(form.phone.trim()))
      return setError('Nomor telepon tidak valid (9–16 digit).');
    if (!form.province.trim()) return setError('Provinsi wajib diisi.');
    if (!form.city.trim()) return setError('Kota/Kabupaten wajib diisi.');
    if (!form.district.trim()) return setError('Kecamatan wajib diisi.');
    if (form.fullAddress.trim().length < 8)
      return setError('Alamat lengkap minimal 8 karakter.');

    const values: AddressFormValues = {
      ...form,
      receiverName: form.receiverName.trim(),
      fullAddress: form.fullAddress.trim(),
      note: form.note?.trim() || undefined,
    };

    if (editing) {
      updateAddress(editing.id, values);
    } else {
      addAddress(values);
    }
    onDone();
  };

  return (
    <>
      <DialogHeader className="pr-10 text-left">
        <DialogTitle className="font-display text-xl font-semibold text-charcoal-900">
          {editing ? 'Ubah Alamat' : 'Tambah Alamat Baru'}
        </DialogTitle>
        <DialogDescription className="text-sm text-charcoal-500">
          Alamat aktif akan dipakai untuk pengantaran pesanan ini.
        </DialogDescription>
      </DialogHeader>

      {/* Area scroll — header di atas dan footer di bawah tetap terlihat */}
      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-0.5">
        {/* Label alamat */}
        <fieldset>
          <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
            Label Alamat
          </legend>
          <div className="flex flex-wrap gap-2">
            {LABELS.map((label) => (
              <button
                key={label}
                type="button"
                aria-pressed={form.label === label}
                onClick={() => setField('label', label)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
                  form.label === label
                    ? 'bg-green-700 text-white shadow-md shadow-green-700/20'
                    : 'border border-sage-100 bg-white text-charcoal-500 hover:border-sage-500/60 hover:text-green-700',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-500">
              Nama Penerima
            </span>
            <input
              value={form.receiverName}
              onChange={(e) => setField('receiverName', e.target.value)}
              placeholder="cth. Arga"
              aria-label="Nama penerima"
              autoComplete="name"
              className={INPUT_CLASS}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-500">
              Nomor Telepon
            </span>
            <input
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="08xxxxxxxxxx"
              inputMode="tel"
              autoComplete="tel"
              aria-label="Nomor telepon"
              className={INPUT_CLASS}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-500">
              Provinsi
            </span>
            <input
              value={form.province}
              onChange={(e) => setField('province', e.target.value)}
              placeholder="Jawa Barat"
              autoComplete="address-level1"
              aria-label="Provinsi"
              className={INPUT_CLASS}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-500">
              Kota/Kabupaten
            </span>
            <input
              value={form.city}
              onChange={(e) => setField('city', e.target.value)}
              placeholder="Bogor"
              autoComplete="address-level2"
              aria-label="Kota atau kabupaten"
              className={INPUT_CLASS}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-500">
              Kecamatan
            </span>
            <input
              value={form.district}
              onChange={(e) => setField('district', e.target.value)}
              placeholder="Bogor Utara"
              autoComplete="address-level3"
              aria-label="Kecamatan"
              className={INPUT_CLASS}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-500">
            Alamat Lengkap
          </span>
          <textarea
            value={form.fullAddress}
            onChange={(e) => setField('fullAddress', e.target.value)}
            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
            rows={3}
            autoComplete="street-address"
            aria-label="Alamat lengkap"
            className={cn(INPUT_CLASS, 'resize-none')}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-500">
            Catatan untuk Kurir{' '}
            <span className="normal-case text-sage-500">(opsional)</span>
          </span>
          <input
            value={form.note ?? ''}
            onChange={(e) => setField('note', e.target.value)}
            placeholder="cth. Titip di pos ronda jika tidak ada di rumah"
            aria-label="Catatan untuk kurir"
            className={INPUT_CLASS}
          />
        </label>
      </div>

      {/* Footer sticky — tombol aksi tidak pernah ikut tergulung */}
      <div className="mt-3 shrink-0 border-t border-sage-100 pt-3">
        {error && (
          <p role="alert" className="mb-2.5 text-xs font-medium text-[#DC2626]">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onDone}
            className="flex-1 rounded-full border border-sage-100 px-5 py-3 text-sm font-semibold text-charcoal-500 transition-colors hover:bg-cream-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/25 transition-colors hover:bg-green-600"
          >
            {editing ? 'Simpan Perubahan' : 'Simpan Alamat'}
          </button>
        </div>
      </div>
    </>
  );
}
