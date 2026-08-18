'use client';

import { useState } from 'react';
import {
  CalendarRange,
  Check,
  ChevronDown,
  Clock,
  EllipsisVertical,
  Eye,
  ListFilter,
  RefreshCcw,
  RotateCcw,
  Search,
  Store,
  Truck,
  Utensils,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BowlThumb,
  BakeryThumb,
  MarketThumb,
  CafeThumb,
  LeafSprig,
} from '@/app/components/order-history/ornaments';

type OrderStatus = 'ready' | 'completed' | 'cancelled';

type Order = {
  id: string;
  date: string;
  time: string;
  merchant: string;
  category: string;
  items: string[];
  pickup: string;
  pickupKind: 'pickup' | 'delivered' | 'expired';
  total: string;
  status: OrderStatus;
  action: 'view' | 'reorder' | 'again';
  thumb: React.ReactNode;
};

const ORDERS: Order[] = [
  {
    id: '#RB-240813',
    date: '13 Aug 2026',
    time: '18:30',
    merchant: 'Green Bowl Kitchen',
    category: 'Fresh meals',
    items: ['2x Surplus Salad Bowl', '1x Fresh Bread Pack'],
    pickup: 'Pickup today, 19:00–20:00',
    pickupKind: 'pickup',
    total: 'Rp 42.000',
    status: 'ready',
    action: 'view',
    thumb: <BowlThumb className="h-11 w-11" />,
  },
  {
    id: '#RB-240810',
    date: '10 Aug 2026',
    time: '12:15',
    merchant: 'Harvest Bakery',
    category: 'Bakery',
    items: ['1x Mixed Pastry Box'],
    pickup: 'Collected on 10 Aug 2026',
    pickupKind: 'delivered',
    total: 'Rp 28.000',
    status: 'completed',
    action: 'reorder',
    thumb: <BakeryThumb className="h-11 w-11" />,
  },
  {
    id: '#RB-240807',
    date: '7 Aug 2026',
    time: '16:40',
    merchant: 'Fresh Roots Market',
    category: 'Produce',
    items: ['1x Imperfect Vegetable Box', '1x Fruit Bundle'],
    pickup: 'Delivered on 7 Aug 2026',
    pickupKind: 'delivered',
    total: 'Rp 55.000',
    status: 'completed',
    action: 'reorder',
    thumb: <MarketThumb className="h-11 w-11" />,
  },
  {
    id: '#RB-240802',
    date: '2 Aug 2026',
    time: '09:20',
    merchant: 'Daily Grind Café',
    category: 'Café',
    items: ['2x Sandwich Combo'],
    pickup: 'Pickup window expired',
    pickupKind: 'expired',
    total: 'Rp 32.000',
    status: 'cancelled',
    action: 'again',
    thumb: <CafeThumb className="h-11 w-11" />,
  },
];

const TABS = [
  { key: 'all', label: 'All orders', count: 28 },
  { key: 'upcoming', label: 'Upcoming', count: 1 },
  { key: 'completed', label: 'Completed', count: 23 },
  { key: 'cancelled', label: 'Cancelled', count: 4 },
] as const;

const STATUS_CONFIG: Record<
  OrderStatus,
  { badge: string; dot: string; icon: React.ReactNode }
> = {
  ready: {
    badge: 'bg-mint text-pine',
    dot: 'bg-leaf',
    icon: <Clock className="h-3 w-3" />,
  },
  completed: {
    badge: 'bg-pine text-mint',
    dot: 'bg-leaf',
    icon: <Check className="h-3 w-3" />,
  },
  cancelled: {
    badge: 'bg-terra/15 text-terra',
    dot: 'bg-terra',
    icon: <Clock className="h-3 w-3" />,
  },
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  ready: 'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function ActionButton({ order }: { order: Order }) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200';

  if (order.action === 'view') {
    return (
      <button
        type="button"
        className={cn(
          base,
          'border border-pine/15 bg-white text-pine hover:border-pine hover:bg-pine hover:text-white'
        )}
      >
        <Eye className="h-3.5 w-3.5" />
        View order
      </button>
    );
  }
  if (order.action === 'reorder') {
    return (
      <button
        type="button"
        className={cn(base, 'text-pine hover:bg-mint')}
      >
        <RefreshCcw className="h-3.5 w-3.5" />
        Reorder
      </button>
    );
  }
  return (
    <button
      type="button"
      className={cn(
        base,
        'border border-terra/25 bg-white text-terra hover:bg-terra hover:text-white'
      )}
    >
      <RotateCcw className="h-3.5 w-3.5" />
      Order again
    </button>
  );
}

function OrderRow({ order }: { order: Order }) {
  const status = STATUS_CONFIG[order.status];

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-pine/5 bg-cream/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf/30 hover:bg-white hover:shadow-[0_14px_34px_-22px_rgba(40,89,67,0.4)] lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_minmax(0,1.6fr)_minmax(0,1.25fr)_78px_120px_auto] lg:items-center lg:gap-x-4 lg:p-3.5 lg:px-5">
      <div className="flex min-w-[210px] flex-1 items-center gap-3 lg:min-w-0 lg:flex-none">
        <span className="shrink-0">{order.thumb}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            {order.id}
            <span className="rounded-full bg-beige px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-moss">
              {order.category}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-moss">
            {order.date} · {order.time}
          </p>
          <p className="mt-0.5 truncate text-xs font-medium text-pine lg:hidden">
            {order.merchant}
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 lg:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/70 text-pine">
          <Store className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">
            {order.merchant}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-leaf">
            <LeafSprig className="h-3 w-3" />
            Eco merchant
          </span>
        </span>
      </div>

      <div className="hidden lg:block">
        <ul className="space-y-0.5">
          {order.items.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[13px] text-ink">
              <Utensils className="h-3 w-3 shrink-0 text-moss" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden items-center gap-2 lg:flex">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            order.pickupKind === 'expired'
              ? 'bg-terra/15 text-terra'
              : 'bg-beige text-pine'
          )}
        >
          {order.pickupKind === 'delivered' ? (
            <Truck className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Clock className="h-4 w-4" strokeWidth={2} />
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-medium text-ink">
            {order.pickup}
          </span>
          <span className="text-[11px] text-moss">
            {order.pickupKind === 'delivered'
              ? 'Delivery completed'
              : order.pickupKind === 'expired'
                ? 'Not collected'
                : 'Pickup slot confirmed'}
          </span>
        </span>
      </div>

      <div className="ml-auto lg:ml-0">
        <p className="text-sm font-semibold tabular-nums text-ink">
          {order.total}
        </p>
        <p className="text-[11px] text-moss lg:hidden">Order total</p>
      </div>

      <div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
            status.badge
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
          {status.icon}
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="flex items-center justify-end gap-1 lg:justify-start">
        <ActionButton order={order} />
        <button
          type="button"
          aria-label={`More options for ${order.id}`}
          className="hidden h-8 w-8 items-center justify-center rounded-full text-moss transition-colors hover:bg-mint hover:text-pine lg:flex"
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

export function OrderTable() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['key']>('all');
  const [query, setQuery] = useState('');

  const filtered = ORDERS.filter((order) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'upcoming' && order.status === 'ready') ||
      (activeTab === 'completed' && order.status === 'completed') ||
      (activeTab === 'cancelled' && order.status === 'cancelled');

    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.merchant.toLowerCase().includes(q) ||
      order.items.some((item) => item.toLowerCase().includes(q)) ||
      order.pickup.toLowerCase().includes(q);

    return matchesTab && matchesQuery;
  });

  return (
    <section className="relative flex flex-col rounded-2xl border border-pine/10 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(40,89,67,0.35)] sm:p-7">
      <LeafSprig className="pointer-events-none absolute -right-4 -top-6 h-16 w-16 text-leaf/15" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-medium tracking-tight text-ink sm:text-xl">
            My recent orders
          </h2>
          <p className="mt-1 text-[13px] text-moss">
            Track rescued meals, pickups, and deliveries.
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative w-full xl:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-moss" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID, merchant, or menu"
            className="h-11 w-full rounded-xl border border-pine/10 bg-cream/60 pl-10 pr-4 text-sm text-ink placeholder:text-moss/70 outline-none transition-all focus:border-leaf focus:bg-white focus:ring-4 focus:ring-leaf/15"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-pine text-white shadow-sm'
                  : 'bg-cream text-moss hover:bg-mint hover:text-pine'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10px] tabular-nums',
                  activeTab === tab.key
                    ? 'bg-white/20'
                    : 'bg-beige text-moss'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-xl border border-pine/10 bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:border-leaf/40 hover:bg-mint/50"
          >
            <CalendarRange className="h-4 w-4 text-moss" />
            Last 30 days
            <ChevronDown className="h-3.5 w-3.5 text-moss" />
          </button>
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-xl border border-pine/10 bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:border-leaf/40 hover:bg-mint/50"
          >
            <ListFilter className="h-4 w-4 text-moss" />
            Newest first
            <ChevronDown className="h-3.5 w-3.5 text-moss" />
          </button>
        </div>
      </div>

      <div className="mt-6 hidden lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_minmax(0,1.6fr)_minmax(0,1.25fr)_78px_120px_auto] lg:gap-x-4 lg:px-5">
        {[
          'Order',
          'Merchant',
          'Items',
          'Pickup / Delivery',
          'Total',
          'Status',
          'Action',
        ].map((col) => (
          <p
            key={col}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-moss"
          >
            {col}
          </p>
        ))}
      </div>

      <ul className="mt-3 space-y-2.5">
        {filtered.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
        {filtered.length === 0 && (
          <li className="rounded-2xl border border-dashed border-pine/15 bg-cream/50 p-8 text-center text-sm text-moss">
            No orders match your filters.
          </li>
        )}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-pine/5 pt-4">
        <p className="text-xs text-moss">
          Showing {filtered.length} of {activeTab === 'all' ? 28 : TABS.find((t) => t.key === activeTab)?.count} orders
        </p>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
                page === 1
                  ? 'bg-pine text-white'
                  : 'text-moss hover:bg-mint hover:text-pine'
              )}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="flex h-8 items-center rounded-lg px-2.5 text-xs font-semibold text-moss transition-colors hover:bg-mint hover:text-pine"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
