'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  NOTIFICATIONS_UPDATED_EVENT,
  getNotifications,
  getUnreadCount,
  markAsRead as storageMarkAsRead,
  markAllAsRead as storageMarkAllAsRead,
  type Notification,
  type NotificationRole,
} from '@/lib/notification-storage';

/**
 * Hook untuk mengelola notifikasi — reactive terhadap perubahan
 * localStorage, persis seperti useOrders / useRebitesCoins.
 */
export function useNotifications(
  userId: string | null | undefined,
  role: NotificationRole
) {
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const notifications = useMemo(() => {
    void tick;
    if (!userId) return [] as Notification[];
    return getNotifications(userId, role);
  }, [userId, role, tick]);

  const unreadCount = useMemo(() => {
    void tick;
    if (!userId) return 0;
    return getUnreadCount(userId, role);
  }, [userId, role, tick]);

  const markRead = useCallback(
    (notificationId: string) => {
      storageMarkAsRead(notificationId);
      refresh();
    },
    [refresh]
  );

  const markAllRead = useCallback(() => {
    if (!userId) return;
    storageMarkAllAsRead(userId, role);
    refresh();
  }, [userId, role, refresh]);

  return { notifications, unreadCount, markRead, markAllRead, refresh };
}
