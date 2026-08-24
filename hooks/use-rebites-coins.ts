'use client';

import { useEffect, useState } from 'react';
import type { CoinTransaction, CoinTransactionType } from '@/lib/types';

const TRANSACTIONS_KEY = 'rebites-coin-transactions';

const LEGACY_KEY = 'rebites-coins';
const COINS_UPDATED_EVENT = 'rebites-coins-updated';
const MAX_TRANSACTIONS = 200;

interface CoinsSnapshot {
  balance: number;
  totalEarned: number;
  transactions: CoinTransaction[];
}

const EMPTY_SNAPSHOT: CoinsSnapshot = {
  balance: 0,
  totalEarned: 0,
  transactions: [],
};

function readLegacyBalance(): number {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { balance?: unknown };
    return Number(parsed.balance) || 0;
  } catch {
    return 0;
  }
}

function readTransactions(): CoinTransaction[] {
  if (typeof window === 'undefined') return [];
  try {
    let raw = window.localStorage.getItem(TRANSACTIONS_KEY);

    if (!raw) {
      const legacy = readLegacyBalance();
      const seeded: CoinTransaction[] = legacy
        ? [
            {
              id: 'coin-migrasi-saldo-awal',
              type: 'earned',
              amount: legacy,
              createdAt: new Date().toISOString(),
              description: 'Saldo awal',
            },
          ]
        : [];
      if (seeded.length > 0) {
        window.localStorage.setItem(
          TRANSACTIONS_KEY,
          JSON.stringify(seeded),
        );
      }
      window.localStorage.removeItem(LEGACY_KEY);
      return seeded;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (tx): tx is CoinTransaction =>
        !!tx &&
        typeof tx === 'object' &&
        typeof (tx as CoinTransaction).id === 'string' &&
        ((tx as CoinTransaction).type === 'earned' ||
          (tx as CoinTransaction).type === 'spent') &&
        Number.isFinite((tx as CoinTransaction).amount),
    );
  } catch {
    return [];
  }
}

function writeTransactions(transactions: CoinTransaction[]) {
  window.localStorage.setItem(
    TRANSACTIONS_KEY,
    JSON.stringify(transactions.slice(0, MAX_TRANSACTIONS)),
  );
  window.dispatchEvent(new Event(COINS_UPDATED_EVENT));
}

function deriveSnapshot(transactions: CoinTransaction[]): CoinsSnapshot {
  let earned = 0;
  let spent = 0;
  for (const tx of transactions) {
    if (tx.type === 'earned') earned += tx.amount;
    else spent += tx.amount;
  }
  return {
    balance: Math.max(0, earned - spent),
    totalEarned: earned,
    transactions,
  };
}

function hasTransactionFor(
  transactions: CoinTransaction[],
  orderId: string,
  type: CoinTransactionType,
): boolean {
  return transactions.some((tx) => tx.type === type && tx.orderId === orderId);
}

export function settleOrderCoins(
  orderId: string,
  { spent, earned }: { spent: number; earned: number },
): boolean {
  if (typeof window === 'undefined') return false;
  if (!orderId) return false;

  const transactions = readTransactions();
  const pending: CoinTransaction[] = [];
  const now = new Date().toISOString();

  if (
    Number.isFinite(spent) &&
    spent > 0 &&
    !hasTransactionFor(transactions, orderId, 'spent')
  ) {
    pending.push({
      id: `coin-tx-${orderId}-spent`,
      orderId,
      type: 'spent',
      amount: Math.round(spent),
      createdAt: now,
      description: 'Potongan pesanan',
    });
  }

  if (
    Number.isFinite(earned) &&
    earned > 0 &&
    !hasTransactionFor(transactions, orderId, 'earned')
  ) {
    pending.push({
      id: `coin-tx-${orderId}-earned`,
      orderId,
      type: 'earned',
      amount: Math.round(earned),
      createdAt: now,
      description: 'Reward pembelian',
    });
  }

  if (pending.length === 0) return false;

  writeTransactions([...pending.reverse(), ...transactions]);
  return true;
}

export function useRebitesCoins(): CoinsSnapshot {
  const [snapshot, setSnapshot] = useState<CoinsSnapshot>(EMPTY_SNAPSHOT);

  useEffect(() => {
    setSnapshot(deriveSnapshot(readTransactions()));
    const onUpdate = () => setSnapshot(deriveSnapshot(readTransactions()));
    window.addEventListener(COINS_UPDATED_EVENT, onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener(COINS_UPDATED_EVENT, onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  return snapshot;
}
