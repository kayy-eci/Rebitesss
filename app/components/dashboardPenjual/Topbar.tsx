'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, Store } from 'lucide-react';
import {
  getSellerStoreSettings,
  STORE_SETTINGS_UPDATED_EVENT,
} from '@/lib/store-settings-storage';
import { VENDOR } from './data';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [storeName, setStoreName] = useState(VENDOR.storeName);

  useEffect(() => {
    const refresh = () => setStoreName(getSellerStoreSettings().storeName);
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
        { }
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-charcoal-900 transition-colors hover:bg-sage-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        { }
        <Link href="/dashboard/penjual" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-white">
            <Store className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-charcoal-900">{storeName}</span>
        </Link>
      </div>
    </header>
  );
}
