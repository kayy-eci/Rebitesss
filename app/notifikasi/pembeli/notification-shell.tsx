'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { ProfileSidebarNav } from '@/app/components/profile-sidebar-nav';

export function NotificationSidebarShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] lg:bg-cream-50">
      <ProfileSidebarNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[280px]">
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-sage-100 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka navigasi"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-charcoal-900"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-base font-semibold text-forest-deep">Notifikasi</span>
        </div>

        <main className="mx-auto max-w-[1100px] px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="hidden lg:block">
            <p className="font-inter text-xs font-semibold uppercase tracking-widest text-sage-600">Kotak Masuk</p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-forest-deep">Notifikasi</h1>
            <p className="mt-1 text-sm text-stone">Pantau promo, pesanan, dan info penting lainnya.</p>
          </div>
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
