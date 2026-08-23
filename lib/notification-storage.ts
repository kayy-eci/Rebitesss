'use client';

/**
 * Sistem notifikasi ReBites — SATU sumber data untuk notifikasi
 * pembeli dan penjual, dipisahkan berdasarkan `role` dan `userId`.
 *
 * Pola sama dengan order-storage / subscription-storage:
 * localStorage sebagai persistence, CustomEvent untuk sinkronisasi
 * lintas komponen, no-op aman di server.
 */

const STORAGE_KEY = 'rebites-notifications';
export const NOTIFICATIONS_UPDATED_EVENT = 'rebites-notifications-updated';
const MAX_NOTIFICATIONS = 100;

// ── Types ──

export type NotificationRole = 'buyer' | 'seller';

export type NotificationType =
  | 'order_created'       // Pesanan dibuat (buyer)
  | 'payment_success'     // Pembayaran berhasil (buyer)
  | 'order_delivering'    // Pesanan sedang diantar (buyer)
  | 'order_completed'     // Pesanan selesai (buyer)
  | 'promo'               // Promosi makanan (buyer)
  | 'incoming_order'      // Pesanan masuk (seller)
  | 'subscription_active' // Langganan aktif (seller)
  | 'subscription_renewed'// Langganan diperpanjang (seller)
  | 'subscription_expiring'// Langganan akan berakhir (seller)
  | 'subscription_changed' // Paket diubah (seller)
  | 'subscription_expired';// Langganan berakhir (seller)

export interface Notification {
  id: string;
  /** ID user penerima notifikasi. */
  userId: string;
  /** Role penerima: buyer atau seller. */
  role: NotificationRole;
  /** Tipe notifikasi. */
  type: NotificationType;
  /** Judul notifikasi. */
  title: string;
  /** Pesan/deskripsi notifikasi. */
  message: string;
  /** Waktu notifikasi dibuat (ISO string). */
  createdAt: string;
  /** Status sudah dibaca atau belum. */
  read: boolean;
  /** Referensi terkait (orderId, storeId, dll). */
  referenceId?: string;
  /** Link navigasi saat notifikasi diklik. */
  href?: string;
}

// ── Helpers ──

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
    // Storage penuh — abaikan.
  }
}

// ── Public API ──

/**
 * Buat notifikasi baru dan simpan ke localStorage.
 * Return notifikasi yang dibuat.
 */
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

/** Ambil semua notifikasi untuk user + role tertentu. */
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

/** Jumlah notifikasi belum dibaca untuk user + role. */
export function getUnreadCount(
  userId: string,
  role: NotificationRole
): number {
  return readAll().filter(
    (n) => n.userId === userId && n.role === role && !n.read
  ).length;
}

/** Tandai satu notifikasi sebagai sudah dibaca. */
export function markAsRead(notificationId: string): void {
  const all = readAll();
  const next = all.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  writeAll(next);
}

/** Tandai semua notifikasi untuk user + role sebagai sudah dibaca. */
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

/** Hapus notifikasi tertentu. */
export function deleteNotification(notificationId: string): void {
  const all = readAll();
  writeAll(all.filter((n) => n.id !== notificationId));
}

/** Hapus semua notifikasi untuk user + role. */
export function clearNotifications(
  userId: string,
  role: NotificationRole
): void {
  const all = readAll();
  writeAll(all.filter((n) => !(n.userId === userId && n.role === role)));
}
