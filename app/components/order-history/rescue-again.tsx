import { ArrowRight, BadgePercent, Clock, MapPin, Star } from 'lucide-react';
import {
  BowlThumb,
  BakeryThumb,
  MarketThumb,
  LeafSprig,
} from '@/app/components/order-history/ornaments';

type Merchant = {
  name: string;
  tagline: string;
  rating: number;
  distance: string;
  pickup: string;
  discount: string;
  thumb: React.ReactNode;
  tint: string;
};

const MERCHANTS: Merchant[] = [
  {
    name: 'Green Bowl Kitchen',
    tagline: 'Fresh meals from Rp 15.000',
    rating: 4.9,
    distance: '1.2 km',
    pickup: 'Pickup 19:00–21:00',
    discount: 'Up to 60% off',
    thumb: <BowlThumb className="h-14 w-14" />,
    tint: 'bg-mint/70',
  },
  {
    name: 'Harvest Bakery',
    tagline: 'Surplus bakery boxes from Rp 12.000',
    rating: 4.8,
    distance: '2.4 km',
    pickup: 'Pickup 08:00–11:00',
    discount: 'Up to 50% off',
    thumb: <BakeryThumb className="h-14 w-14" />,
    tint: 'bg-beige/70',
  },
  {
    name: 'Fresh Roots Market',
    tagline: 'Imperfect produce from Rp 20.000',
    rating: 4.7,
    distance: '3.1 km',
    pickup: 'Pickup 16:00–19:00',
    discount: 'Up to 45% off',
    thumb: <MarketThumb className="h-14 w-14" />,
    tint: 'bg-mint/50',
  },
];

export function RescueAgain() {
  return (
    <section className="relative">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium tracking-tight text-ink sm:text-xl">
            Rescue food again
          </h2>
          <p className="mt-1 text-[13px] text-moss">
            Nearby merchants with rescued surplus food waiting for you.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-pine underline-offset-4 transition-colors hover:text-leaf hover:underline"
        >
          Browse all merchants
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MERCHANTS.map((merchant) => (
          <article
            key={merchant.name}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-pine/10 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(40,89,67,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-leaf/40 hover:shadow-[0_22px_46px_-26px_rgba(40,89,67,0.45)]"
          >
            <LeafSprig className="pointer-events-none absolute -right-3 -top-4 h-14 w-14 text-leaf/15" />

            <div className="relative flex items-start justify-between">
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${merchant.tint} transition-transform duration-500 group-hover:scale-105`}
              >
                {merchant.thumb}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-terra/10 px-2.5 py-1 text-[11px] font-semibold text-terra">
                <BadgePercent className="h-3.5 w-3.5" />
                {merchant.discount}
              </span>
            </div>

            <h3 className="relative mt-4 font-display text-base font-medium tracking-tight text-ink">
              {merchant.name}
            </h3>
            <p className="relative mt-1 text-[13px] text-moss">
              {merchant.tagline}
            </p>

            <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-moss">
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                <span className="font-semibold text-ink">{merchant.rating}</span>
                <span>(120+)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-leaf" />
                {merchant.distance}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-leaf" />
                {merchant.pickup}
              </span>
            </div>

            <button
              type="button"
              className="relative mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-mint px-4 text-[13px] font-semibold text-pine transition-all duration-300 hover:bg-pine hover:text-white"
            >
              View offers
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
