'use client';

import Link from 'next/link';
import { Bell, Menu, Plus, Search, Settings } from 'lucide-react';
import { VENDOR } from './data';
import { SmartImage } from '@/app/components/SmartImage';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-sage-100 bg-cream-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal-900 transition-colors hover:bg-sage-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-500" />
          <input
            type="search"
            placeholder="Cari menu atau pesanan masuk..."
            aria-label="Cari menu atau pesanan masuk"
            className="w-full rounded-full border border-sage-100 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal-900 placeholder:text-sage-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
          <button
            type="button"
            aria-label="Notifikasi"
            className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-900 transition-colors hover:bg-sage-100"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Pengaturan"
            className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-900 transition-colors hover:bg-sage-100"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden h-9 w-px bg-sage-100 md:block" />

        <div className="hidden items-center gap-2.5 md:flex">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-sage-100">
            <SmartImage src={VENDOR.avatar} alt="Foto profil Bu Tini" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-charcoal-900">{VENDOR.storeName}</p>
            <p className="text-[11px] text-sage-500">{VENDOR.tier}</p>
          </div>
        </div>

        <Link
          href="/dashboardPenjual/tambahMenu"
          aria-label="Tambahkan menu baru"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
        >
          <span className="hidden md:inline">Tambahkan Menu</span>
          <Plus className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
