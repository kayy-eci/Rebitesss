'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  NOTIFICATIONS_UPDATED_EVENT,
  getNotifications,
  getUnreadCount,
  markAsRead as storageMarkAsRead,
  markAllAsRead as storageMarkAllAsRead,
  type Notification,
  type NotificationRole,
} from '@/lib/notification-storage';

export function useNotifications(
  userId: string | null | undefined,
  role: NotificationRole
) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setNotifications(getNotifications(userId, role));
    setUnreadCount(getUnreadCount(userId, role));
  }, [userId, role]);

  useEffect(() => {
    refresh();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

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
