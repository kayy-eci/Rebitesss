import type { Metadata } from 'next';
import { OrderHistoryShell } from '@/app/components/order-history/order-history-shell';
import { OrderPageHeader } from '@/app/components/order-history/page-header';
import { OrderSummaryCards } from '@/app/components/order-history/summary-cards';
import { OrderTable } from '@/app/components/order-history/order-table';
import { OrderImpactPanel } from '@/app/components/order-history/eco-impact';
import { RescueAgain } from '@/app/components/order-history/rescue-again';

export const metadata: Metadata = {
  title: 'Order History | Rebites',
  description:
    'Track your rescued meals, pickups, deliveries, and sustainable impact with the Rebites order history.',
};

export default function OrderHistoryPage() {
  return (
    <OrderHistoryShell>
      <div className="mx-auto max-w-[1400px] space-y-5">
        <OrderPageHeader />
        <OrderSummaryCards />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2">
            <OrderTable />
          </div>
          <OrderImpactPanel />
        </div>

        <RescueAgain />
      </div>
    </OrderHistoryShell>
  );
}
