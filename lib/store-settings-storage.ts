'use client';

const STORAGE_KEY = 'rebites-seller-store-settings';

export const STORE_SETTINGS_UPDATED_EVENT = 'rebites-seller-store-updated';

export interface SellerStoreSettings {
  /** Status toko yang diatur penjual dari card Profil Toko. */
  isOpen: boolean;
  /** Nama toko — bisa diedit dari dashboard. */
  storeName: string;
  /** Deskripsi toko. */
  description: string;
  /** URL foto/logo toko. */
  image: string;
  /** Alamat toko. */
  address: string;
}

const DEFAULT_SETTINGS: SellerStoreSettings = {
  isOpen: true,
  storeName: 'Dapur Ibu Tini',
  description:
    'Dapur rumahan spesialis kudapan pasar buatan sendiri, dari martabak dan pancong hangat sampai ketoprak dan salad buah segar.',
  image:
    'https://images.pexels.com/photos/30294334/pexels-photo-30294334.jpeg?auto=compress&cs=tinysrgb&w=800',
  address: 'Jl. Raya Tajur No. 12, Bogor',
};

function readSettings(): SellerStoreSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<SellerStoreSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function getSellerStoreSettings(): SellerStoreSettings {
  return readSettings();
}

export function setStoreOpen(isOpen: boolean): void {
  const current = readSettings();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...current, isOpen } satisfies SellerStoreSettings)
  );
  window.dispatchEvent(new Event(STORE_SETTINGS_UPDATED_EVENT));
}

export function updateStoreSettings(
  patch: Partial<Omit<SellerStoreSettings, 'isOpen'>>
): void {
  const current = readSettings();
  const next = { ...current, ...patch };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(STORE_SETTINGS_UPDATED_EVENT));
}
