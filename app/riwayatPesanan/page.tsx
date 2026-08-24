import { Suspense } from 'react';
import type { Metadata } from 'next';
import { OrderHistoryView } from '@/app/components/order-history/order-history-view';

export const metadata: Metadata = {
  title: 'Pesanan Saya | ReBites',
  description:
    'Lacak pesanan yang sedang berlangsung dan lihat riwayat belanja makanan di ReBites.',
};

export default function OrderHistoryPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Suspense
          fallback={
            <div className="space-y-5">
              <div className="h-14 w-56 animate-pulse rounded-xl bg-white ring-1 ring-hairline" />
              <div className="h-52 animate-pulse rounded-2xl bg-white ring-1 ring-hairline" />
            </div>
          }
        >
          <OrderHistoryView />
        </Suspense>
      </div>
    </main>
  );
}
