import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BuyerNotificationView } from '@/app/components/notification/buyer-notification-view';

export const metadata: Metadata = {
  title: 'Notifikasi | ReBites',
  description: 'Lihat notifikasi pesanan dan promosi untuk pembeli ReBites.',
};

export default function BuyerNotificationPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-10 w-48 animate-pulse rounded-xl bg-white ring-1 ring-hairline" />
              <div className="flex gap-2">
                <div className="h-9 w-16 animate-pulse rounded-full bg-white ring-1 ring-hairline" />
                <div className="h-9 w-20 animate-pulse rounded-full bg-white ring-1 ring-hairline" />
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-hairline"
                />
              ))}
            </div>
          }
        >
          <BuyerNotificationView />
        </Suspense>
      </div>
    </main>
  );
}
