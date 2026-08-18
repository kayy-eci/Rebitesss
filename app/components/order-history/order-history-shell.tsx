'use client';

import { useState } from 'react';
import { OrderSidebar } from '@/app/components/order-history/sidebar';
import { OrderHeader } from '@/app/components/order-history/header';

export function OrderHistoryShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream">
      <OrderSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <OrderHeader onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
