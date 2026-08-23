'use client';

import { vendorInfo } from '@/app/components/dashboardPenjual/data';

/**
 * Dompet penjual (demo) — saldo & riwayat penarikan disimpan di
 * localStorage dengan pola yang sama seperti storage lain. Saldo awal
 * berasal dari data dashboard yang sudah ada (withdrawableBalance).
 */

const STORAGE_KEY = 'rebites-seller-wallet';

export const WALLET_UPDATED_EVENT = 'rebites-seller-wallet-updated';

export interface WithdrawalRecord {
  id: string;
  amount: number;
  methodId: string;
  methodLabel: string;
  requestedAt: string;
  status: 'diproses';
}

export const WITHDRAWAL_MIN = 50_000;

export function getInitialBalance(): number {
  return vendorInfo.withdrawableBalance;
}

interface StoredWallet {
  balance: number;
  withdrawals: WithdrawalRecord[];
}

function readWallet(): StoredWallet {
  if (typeof window === 'undefined') {
    return { balance: getInitialBalance(), withdrawals: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredWallet>;
      if (typeof parsed.balance === 'number' && Array.isArray(parsed.withdrawals)) {
        return { balance: parsed.balance, withdrawals: parsed.withdrawals };
      }
    }
  } catch {
    /* korup → fallback ke saldo awal */
  }
  return { balance: getInitialBalance(), withdrawals: [] };
}

function writeWallet(wallet: StoredWallet): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  window.dispatchEvent(new Event(WALLET_UPDATED_EVENT));
}

export function getSellerWallet(): { balance: number; withdrawals: WithdrawalRecord[] } {
  return readWallet();
}

export type WithdrawalResult =
  | { ok: true; record: WithdrawalRecord; balance: number }
  | { ok: false; error: string };

/** Ajukan penarikan — memvalidasi nominal terhadap saldo tersimpan. */
export function requestWithdrawal(input: {
  amount: number;
  methodId: string;
  methodLabel: string;
}): WithdrawalResult {
  const amount = Math.round(input.amount);
  const wallet = readWallet();

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Nominal penarikan tidak valid.' };
  }
  if (amount < WITHDRAWAL_MIN) {
    return {
      ok: false,
      error: `Minimal penarikan Rp${WITHDRAWAL_MIN.toLocaleString('id-ID')}.`,
    };
  }
  if (amount > wallet.balance) {
    return { ok: false, error: 'Nominal melebihi saldo yang bisa dicairkan.' };
  }

  const record: WithdrawalRecord = {
    id: `WD-${Date.now().toString(36).toUpperCase()}`,
    amount,
    methodId: input.methodId,
    methodLabel: input.methodLabel,
    requestedAt: new Date().toISOString(),
    status: 'diproses',
  };

  const nextBalance = wallet.balance - amount;
  writeWallet({
    balance: nextBalance,
    withdrawals: [record, ...wallet.withdrawals],
  });

  return { ok: true, record, balance: nextBalance };
}
