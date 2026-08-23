'use client';

const STORAGE_KEY = 'rebites-seller-store-settings';

export const STORE_SETTINGS_UPDATED_EVENT = 'rebites-seller-store-updated';

export interface SellerStoreSettings {
  /** Status toko yang diatur penjual dari card Profil Toko. */
  isOpen: boolean;
}

function readSettings(): SellerStoreSettings {
  if (typeof window === 'undefined') return { isOpen: true };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isOpen: true };
    const parsed = JSON.parse(raw) as Partial<SellerStoreSettings>;
    return { isOpen: parsed.isOpen !== false };
  } catch {
    return { isOpen: true };
  }
}

export function getSellerStoreSettings(): SellerStoreSettings {
  return readSettings();
}

export function setStoreOpen(isOpen: boolean): void {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ isOpen } satisfies SellerStoreSettings)
  );
  window.dispatchEvent(new Event(STORE_SETTINGS_UPDATED_EVENT));
}
