'use client';

import { Camera, ImagePlus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/app/components/SmartImage';
import { FOOD_PRESETS } from './types';

interface PhotoPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhotoPicker({ value, onChange }: PhotoPickerProps) {
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div>
      {value ? (
        <div className="relative h-44 overflow-hidden rounded-2xl border border-sage-100">
          <SmartImage src={value} alt="Pratinjau foto menu" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-gradient-to-t from-charcoal-900/85 to-transparent p-3">
            <label
              htmlFor="menu-photo-input"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-cream-50 px-3 py-1.5 text-[11px] font-semibold text-charcoal-900 transition-colors hover:bg-white"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Ganti Foto
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/25 px-3 py-1.5 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-cream-50/40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="menu-photo-input"
          className="flex h-44 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-sage-100 bg-cream-50 text-center transition-colors hover:border-sage-500/60 hover:bg-sage-100/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-primary">
            <Camera className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-charcoal-900">
              Upload Foto Menu
            </span>
            <span className="mt-0.5 block text-[11px] text-sage-500">
              PNG atau JPG, maksimal 5 MB
            </span>
          </span>
        </label>
      )}

      <input
        id="menu-photo-input"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
      />

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-500">
        atau pilih contoh foto
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {FOOD_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.src)}
            aria-label={`Gunakan contoh foto ${preset.label}`}
            className={cn(
              'relative h-14 w-14 overflow-hidden rounded-xl ring-2 transition-all',
              value === preset.src
                ? 'ring-primary ring-offset-2 ring-offset-cream-50'
                : 'ring-sage-100 hover:ring-sage-500/50'
            )}
          >
            <SmartImage src={preset.src} alt={`Contoh foto ${preset.label}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
