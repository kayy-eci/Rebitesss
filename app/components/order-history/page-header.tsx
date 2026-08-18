import { Download, Filter, ShoppingBasket } from 'lucide-react';
import { LeafSprig } from '@/app/components/order-history/ornaments';

export function OrderPageHeader() {
  return (
    <section className="relative overflow-hidden">
      <LeafSprig className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rotate-12 text-leaf/20 animate-sway" />
      <LeafSprig className="pointer-events-none absolute right-24 -top-4 hidden h-14 w-14 -rotate-6 text-sage/40 lg:block animate-sway [animation-delay:1.4s]" />

      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-[11px] font-semibold text-pine">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
            Eco orders · 28 total
          </span>
          <h1 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            Order History
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-moss">
            Track your rescued meals, pickups, deliveries, and sustainable
            impact.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-full border border-pine/15 bg-white px-4 text-[13px] font-semibold text-ink transition-colors hover:border-leaf/50 hover:bg-mint/50"
          >
            <Filter className="h-4 w-4 text-moss" />
            Filter
          </button>
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-full border border-pine/40 bg-transparent px-4 text-[13px] font-semibold text-pine transition-all duration-300 hover:bg-pine hover:text-cream"
          >
            <Download className="h-4 w-4" />
            Export history
          </button>
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-full bg-pine px-5 text-[13px] font-semibold text-cream shadow-[0_10px_26px_-12px_rgba(40,89,67,0.55)] transition-all duration-300 hover:bg-leaf hover:text-pine hover:shadow-[0_12px_30px_-12px_rgba(118,184,82,0.7)]"
          >
            <ShoppingBasket className="h-4 w-4" />
            Browse food
          </button>
        </div>
      </div>
    </section>
  );
}
