'use client';

import { createNotification, getNotifications } from './notification-storage';
import { urgentItems, promoCodes } from './data';
import type { NotificationType } from './notification-storage';

const PROMO_STORAGE_KEY = 'rebites-promo-notifications-created';

function hasCreatedPromos(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(PROMO_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function markPromosCreated(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROMO_STORAGE_KEY, 'true');
  } catch {

  }
}

export function ensurePromoNotifications(userId: string): void {
  if (typeof window === 'undefined') return;
  if (hasCreatedPromos()) return;

  const now = new Date();
  const hours = now.getHours();

  const activeItems = urgentItems.filter((item) => {
    const [fromH] = item.availableFrom.split(':').map(Number);
    const [toH] = item.availableTo.split(':').map(Number);
    return hours >= fromH && hours < toH;
  });

  if (activeItems.length > 0) {
    const item = activeItems[0];
    createNotification({
      userId,
      role: 'buyer',
      type: 'promo',
      title: '🔥 Flash Sale Aktif!',
      message: `${item.name} dari ${item.vendorName} sedang diskon ${item.discountPercent}%! Harga ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.discountedPrice)} (hemat ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.originalPrice - item.discountedPrice)}). Stok terbatas!`,
      href: '/home',
    });
  }

  const validPromo = promoCodes.find((p) => p.isValid);
  if (validPromo) {
    createNotification({
      userId,
      role: 'buyer',
      type: 'promo',
      title: '🏷️ Kode Promo Tersedia!',
      message: `Gunakan kode ${validPromo.code} saat checkout untuk mendapatkan diskon ${validPromo.percentOff}%! Berlaku untuk semua produk.`,
      href: '/home',
    });
  }

  createNotification({
    userId,
    role: 'buyer',
    type: 'promo',
    title: '🍽️ Menu Baru Hari Ini!',
    message: 'Cek menu makanan baru dari UMKM favoritmu! Makanan segar surplus tersedia dengan harga spesial setiap hari.',
    href: '/home',
  });

  markPromosCreated();
}
