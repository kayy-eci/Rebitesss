'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

  const refresh = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    const [list, unread] = await Promise.all([
      getNotifications(userId, role),
      getUnreadCount(userId, role),
    ]);
    setNotifications(list);
    setUnreadCount(unread);
  }, [userId, role]);

  useEffect(() => {
    refresh();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);

    let channel: ReturnType<typeof supabase.channel> | null = null;
    if (userId) {
      channel = supabase
        .channel(`rebites-notifications-${role}-${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => refresh()
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
      if (channel) supabase.removeChannel(channel);
    };
  }, [refresh, userId, role]);

  const markRead = useCallback(
    (notificationId: string) => {
      storageMarkAsRead(notificationId).then(() => refresh());
    },
    [refresh]
  );

  const markAllRead = useCallback(() => {
    if (!userId) return;
    storageMarkAllAsRead(userId, role).then(() => refresh());
  }, [userId, role, refresh]);

  return { notifications, unreadCount, markRead, markAllRead, refresh };
}
