import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SubscriptionCheckoutView } from '@/app/components/subscription/subscription-checkout-view';

export const metadata: Metadata = {
  title: 'Pembayaran Langganan | ReBites',
  description:
    'Selesaikan langganan paket penjual ReBites untuk mengaktifkan toko UMKM kamu.',
};

export default function SubscriptionPaymentPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Suspense
          fallback={
            <div className="space-y-5">
              <div className="h-9 w-40 animate-pulse rounded-full bg-white ring-1 ring-hairline" />
              <div className="h-10 w-72 animate-pulse rounded-xl bg-white ring-1 ring-hairline" />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                <div className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-hairline lg:col-span-3" />
                <div className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-hairline lg:col-span-2" />
              </div>
            </div>
          }
        >
          <SubscriptionCheckoutView />
        </Suspense>
      </div>
    </main>
  );
}
