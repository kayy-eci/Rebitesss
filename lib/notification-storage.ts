'use client';

const STORAGE_KEY = 'rebites-notifications';
export const NOTIFICATIONS_UPDATED_EVENT = 'rebites-notifications-updated';
const MAX_NOTIFICATIONS = 100;

export type NotificationRole = 'buyer' | 'seller';

export type NotificationType =
  | 'order_created'
  | 'payment_success'
  | 'order_delivering'
  | 'order_completed'
  | 'promo'
  | 'incoming_order'
  | 'subscription_active'
  | 'subscription_renewed'
  | 'subscription_expiring'
  | 'subscription_changed'
  | 'subscription_expired';

export interface Notification {
  id: string;

  userId: string;

  role: NotificationRole;

  type: NotificationType;

  title: string;

  message: string;

  createdAt: string;

  read: boolean;

  referenceId?: string;

  href?: string;
}

function createNotificationId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NTF-${stamp}${rand}`;
}

function readAll(): Notification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Notification =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as Notification).id === 'string' &&
        typeof (item as Notification).userId === 'string' &&
        typeof (item as Notification).type === 'string'
    );
  } catch {
    return [];
  }
}

function writeAll(notifications: Notification[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS))
    );
    window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
  } catch {

  }
}

export function createNotification(
  input: Omit<Notification, 'id' | 'createdAt' | 'read'>
): Notification {
  const notification: Notification = {
    ...input,
    id: createNotificationId(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  const all = readAll();
  const next = [notification, ...all].slice(0, MAX_NOTIFICATIONS);
  writeAll(next);
  return notification;
}

export function getNotifications(
  userId: string,
  role: NotificationRole
): Notification[] {
  return readAll()
    .filter((n) => n.userId === userId && n.role === role)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getUnreadCount(
  userId: string,
  role: NotificationRole
): number {
  return readAll().filter(
    (n) => n.userId === userId && n.role === role && !n.read
  ).length;
}

export function markAsRead(notificationId: string): void {
  const all = readAll();
  const next = all.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  writeAll(next);
}

export function markAllAsRead(
  userId: string,
  role: NotificationRole
): void {
  const all = readAll();
  const next = all.map((n) =>
    n.userId === userId && n.role === role ? { ...n, read: true } : n
  );
  writeAll(next);
}

export function deleteNotification(notificationId: string): void {
  const all = readAll();
  writeAll(all.filter((n) => n.id !== notificationId));
}

export function clearNotifications(
  userId: string,
  role: NotificationRole
): void {
  const all = readAll();
  writeAll(all.filter((n) => !(n.userId === userId && n.role === role)));
}
