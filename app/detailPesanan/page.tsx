import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  orderDraft,
  promoCodes,
} from '@/lib/data';
import { CheckoutProvider } from '@/app/components/checkout/checkout-context';
import { CheckoutDecor } from '@/app/components/checkout/checkout-decor';
import { StepIndicator } from '@/app/components/checkout/step-indicator';
import { OrderItemCard } from '@/app/components/checkout/order-item-card';
import { QuantityStepperCard } from '@/app/components/checkout/quantity-stepper-card';
import { PickupInfoRow } from '@/app/components/checkout/pickup-info-row';
import { PaymentMethodList } from '@/app/components/checkout/payment-method-list';
import { FaqAccordion } from '@/app/components/checkout/faq-accordion';
import { PaymentSummaryCard } from '@/app/components/checkout/payment-summary-card';
import { PickupCodeNote } from '@/app/components/checkout/pickup-code-note';
import { StickyMobileBar } from '@/app/components/checkout/sticky-mobile-bar';

export default function DetailPesananPage() {
  return (
    <main className="relative min-h-screen bg-cream-50 pb-28 lg:pb-16">
      <CheckoutDecor />

      <CheckoutProvider
        draft={orderDraft}
        promoCodes={promoCodes}
      >
        <div className="relative mx-auto max-w-[1400px] px-5 pt-6 sm:px-8 lg:px-12 lg:pt-10">
          {/* Header mini */}
          <div className="flex items-center gap-3">
            <Link
              href="/homePage"
              aria-label="Kembali"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-100 bg-white text-green-700 transition-colors hover:bg-green-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
              Langkah 2 dari 3 · Pembayaran
            </p>
          </div>

          <div className="mt-6 max-w-2xl lg:mt-8">
            <StepIndicator active={1} />
          </div>

          <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em] text-charcoal-900">
            Detail <span className="font-extralight italic">pesanan</span>
          </h1>

          <div className="mt-8 grid items-start gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-10">
            {/* Kolom kiri — detail pesanan */}
            <div className="space-y-4 sm:space-y-6">
              <OrderItemCard />

              <div id="checkout-qty-card" className="scroll-mt-28">
                <QuantityStepperCard />
              </div>

              <PickupInfoRow />

              <PaymentMethodList />

              <FaqAccordion />
            </div>

            {/* Kolom kanan — ringkasan pembayaran (sticky) */}
            <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <PaymentSummaryCard />
              <PickupCodeNote />
            </div>
          </div>
        </div>

        <StickyMobileBar />
      </CheckoutProvider>
    </main>
  );
}
