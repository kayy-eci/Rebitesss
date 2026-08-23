'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { DashboardDecor } from './decor';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface SellerShellProps {
  children: ReactNode;
}

/**
 * Kerangka halaman dashboard penjual — decor, sidebar, topbar, dan
 * container main dipasang sekali agar seluruh route penjual konsisten.
 */
export function SellerShell({ children }: SellerShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-cream-50 font-sans text-charcoal-900">
        <DashboardDecor />

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="relative z-10 lg:pl-[280px]">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="mx-auto max-w-[1400px] px-4 pb-20 pt-6 sm:px-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
