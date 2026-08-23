'use client';

import { useEffect, useState } from 'react';
import type { CoinHistoryEntry } from '@/lib/types';

/**
 * ReBites Coin — reward 2% dari subtotal produk per transaksi.
 * Disimpan di localStorage agar saldo persisten antar refresh/navigasi.
 * Coin diberikan HANYA lewat grantCoinsForOrder (idempotent per orderId).
 */

const STORAGE_KEY = 'rebites-coins';
const REWARDED_KEY = 'rebites-rewarded-order-ids';
const COINS_UPDATED_EVENT = 'rebites-coins-updated';
const MAX_HISTORY = 50;

interface StoredCoinState {
  balance: number;
  totalEarned: number;
  history: CoinHistoryEntry[];
}

const EMPTY_STATE: StoredCoinState = {
  balance: 0,
  totalEarned: 0,
  history: [],
};

function readState(): StoredCoinState {
  if (typeof window === 'undefined') return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<StoredCoinState>;
    return {
      balance: Number(parsed.balance) || 0,
      totalEarned: Number(parsed.totalEarned) || 0,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

function writeState(state: StoredCoinState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(COINS_UPDATED_EVENT));
}

function readRewardedOrderIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(REWARDED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeRewardedOrderIds(ids: string[]) {
  window.localStorage.setItem(REWARDED_KEY, JSON.stringify(ids));
}

/**
 * Berikan Coin untuk satu order. Mengembalikan false jika order ini
 * sudah pernah diberi reward — mencegah double click, refresh halaman
 * hasil, atau callback ganda memberikan Coin dua kali.
 */
export function grantCoinsForOrder(orderId: string, amount: number): boolean {
  if (typeof window === 'undefined') return false;
  if (!orderId || !Number.isFinite(amount) || amount <= 0) return false;

  const rewarded = readRewardedOrderIds();
  if (rewarded.includes(orderId)) return false;

  const state = readState();
  writeState({
    balance: state.balance + amount,
    totalEarned: state.totalEarned + amount,
    history: [
      { orderId, amount, createdAt: new Date().toISOString() },
      ...state.history,
    ].slice(0, MAX_HISTORY),
  });
  writeRewardedOrderIds([...rewarded, orderId]);
  return true;
}

/** Hook untuk membaca saldo Coin secara realtime (lintas komponen). */
export function useRebitesCoins(): StoredCoinState {
  const [state, setState] = useState<StoredCoinState>(EMPTY_STATE);

  useEffect(() => {
    setState(readState());
    const onUpdate = () => setState(readState());
    window.addEventListener(COINS_UPDATED_EVENT, onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener(COINS_UPDATED_EVENT, onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  return state;
}
