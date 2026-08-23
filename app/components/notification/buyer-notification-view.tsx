'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react';
import { getCurrentUserId } from '@/lib/current-user';
import { useNotifications } from '@/hooks/use-notifications';
import type { NotificationType } from '@/lib/notification-storage';
import { ensurePromoNotifications } from '@/lib/promo-notifications';
import { NotificationCard } from './notification-card';
import { cn } from '@/lib/utils';

type NotificationFilter = 'all' | 'order' | 'payment' | 'promo';

const FILTER_TABS: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'order', label: 'Pesanan' },
  { value: 'payment', label: 'Pembayaran' },
  { value: 'promo', label: 'Promosi' },
];

const ORDER_TYPES: NotificationType[] = [
  'order_created',
  'order_delivering',
  'order_completed',
];
const PAYMENT_TYPES: NotificationType[] = ['payment_success'];
const PROMO_TYPES: NotificationType[] = ['promo'];

export function BuyerNotificationView() {
  const userId = getCurrentUserId();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications(userId, 'buyer');
  const [filter, setFilter] = useState<NotificationFilter>('all');

  // Pastikan notifikasi promosi dibuat saat pertama kali dibuka
  useEffect(() => {
    ensurePromoNotifications(userId);
  }, [userId]);

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    const types =
      filter === 'order'
        ? ORDER_TYPES
        : filter === 'payment'
          ? PAYMENT_TYPES
          : PROMO_TYPES;
    return notifications.filter((n) => types.includes(n.type));
  }, [notifications, filter]);

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link
            href="/home"
            className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2 -ml-2 text-[13px] font-semibold text-charcoal-500 transition-colors hover:bg-white hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Beranda
          </Link>
          <h1 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-medium leading-tight tracking-[-0.02em] text-charcoal-900">
            Notifikasi
          </h1>
          <p className="mt-1 text-sm text-sage-500">
            Pantau aktivitas pesanan dan promosi untukmu.
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
      <div className="flex flex-wrap gap-2" role="tablist">
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
      <div className="space-y-2.5">
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
                ? 'Notifikasi tentang pesanan dan promosi akan muncul di sini.'
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
    </div>
  );
}
