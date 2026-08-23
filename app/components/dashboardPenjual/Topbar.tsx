'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, Menu, Plus, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getSellerStoreSettings,
  STORE_SETTINGS_UPDATED_EVENT,
} from '@/lib/store-settings-storage';
import { SmartImage } from '@/app/components/SmartImage';
import { VENDOR } from './data';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [settings, setSettings] = useState(() => ({
    storeName: VENDOR.storeName,
    image: VENDOR.avatar,
  }));

  useEffect(() => {
    const refresh = () => {
      const s = getSellerStoreSettings();
      setSettings({ storeName: s.storeName, image: s.image || VENDOR.avatar });
    };
    refresh();
    window.addEventListener(STORE_SETTINGS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STORE_SETTINGS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-sage-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-10">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-charcoal-900 transition-colors hover:bg-sage-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand — desktop only */}
        <Link
          href="/dashboard/penjual"
          className="hidden items-center gap-2 lg:flex"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-white">
            <Store className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-charcoal-900">
            {settings.storeName}
          </span>
        </Link>

        {/* Separator */}
        <div className="hidden h-5 w-px bg-sage-100 lg:block" />

        {/* Store profile — right side */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-charcoal-500 transition-colors hover:bg-sage-100 hover:text-charcoal-900"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="hidden h-5 w-px bg-sage-100 md:block" />

          <Link
            href="/toko/dapur-ibu-tini"
            aria-label="Lihat profil toko"
            className="hidden items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-sage-100 md:flex"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-sage-100">
              <SmartImage src={settings.image} alt="Foto profil toko" />
            </div>
            <div className="hidden leading-tight xl:block">
              <p className="text-xs font-semibold text-charcoal-900">
                {settings.storeName}
              </p>
              <p className="text-[10px] text-sage-500">Lihat Toko</p>
            </div>
          </Link>

          <Link
            href="/dashboard/penjual/tambahMenu"
            aria-label="Tambahkan menu baru"
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-green-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-green-700/20 transition-colors hover:bg-green-600'
            )}
          >
            <span className="hidden md:inline">Tambah Menu</span>
            <Plus className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
