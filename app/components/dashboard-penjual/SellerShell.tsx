'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { DashboardDecor } from './decor';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useRequireSeller } from '@/hooks/use-require-seller';

interface SellerShellProps {
  children: ReactNode;
}

export function SellerShell({ children }: SellerShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useRequireSeller();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-cream-50 font-sans text-charcoal-900">
        <DashboardDecor />

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="relative z-10 lg:pl-[280px]">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-4 sm:px-6 sm:pt-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
