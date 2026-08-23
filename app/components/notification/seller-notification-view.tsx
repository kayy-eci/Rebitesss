'use client';

import { useMemo, useState } from 'react';

import { Bell, CheckCheck } from 'lucide-react';
import { getCurrentUserId } from '@/lib/current-user';
import { useNotifications } from '@/hooks/use-notifications';
import type { NotificationType } from '@/lib/notification-storage';
import { NotificationCard } from './notification-card';
import { SellerShell } from '@/app/components/dashboardPenjual/SellerShell';
import { cn } from '@/lib/utils';

type NotificationFilter = 'all' | 'order' | 'subscription';

const FILTER_TABS: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'order', label: 'Pesanan Masuk' },
  { value: 'subscription', label: 'Langganan' },
];

const ORDER_TYPES: NotificationType[] = ['incoming_order'];
const SUBSCRIPTION_TYPES: NotificationType[] = [
  'subscription_active',
  'subscription_renewed',
  'subscription_expiring',
  'subscription_changed',
  'subscription_expired',
];

export function SellerNotificationView() {
  const userId = getCurrentUserId();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications(userId, 'seller');
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    const types =
      filter === 'order' ? ORDER_TYPES : SUBSCRIPTION_TYPES;
    return notifications.filter((n) => types.includes(n.type));
  }, [notifications, filter]);

  return (
    <SellerShell>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Dashboard Penjual
          </p>
          <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-forest-900">
            Notifikasi
          </h1>
          <p className="mt-1 text-sm text-sage-500">
            Pantau pesanan masuk dan status langganan toko.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 rounded-full border border-green-700 px-4 py-2 text-xs font-semibold text-green-700 transition-colors hover:bg-green-700 hover:text-white"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2" role="tablist">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={filter === tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
              filter === tab.value
                ? 'bg-green-700 text-white shadow-sm shadow-green-700/25'
                : 'border border-sage-100 bg-white text-charcoal-500 hover:text-charcoal-900'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="mt-5 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-cream-50 px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-charcoal-500">
              <Bell className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-medium text-charcoal-900">
              Belum ada notifikasi
            </h3>
            <p className="mt-1 max-w-xs text-sm text-charcoal-500">
              {filter === 'all'
                ? 'Notifikasi pesanan masuk dan langganan akan muncul di sini.'
                : 'Tidak ada notifikasi untuk filter ini.'}
            </p>
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={markRead}
            />
          ))
        )}
      </div>
    </SellerShell>
  );
}
