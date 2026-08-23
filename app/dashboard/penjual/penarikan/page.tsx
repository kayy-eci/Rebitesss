'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, BadgeCheck, Info, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/data';
import {
  WALLET_UPDATED_EVENT,
  WITHDRAWAL_MIN,
  getSellerWallet,
  requestWithdrawal,
  type WithdrawalRecord,
} from '@/lib/wallet-storage';
import { SellerShell } from '@/app/components/dashboardPenjual/SellerShell';
import { Card } from '@/app/components/dashboardPenjual/Card';

const BANK_METHODS = [
  { id: 'bca', label: 'BCA · 4821' },
  { id: 'bri', label: 'BRI · 3021' },
  { id: 'mandiri', label: 'Mandiri · 7754' },
];

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PenarikanDanaPage() {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState(BANK_METHODS[0].id);
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);

  useEffect(() => {
    const refresh = () => {
      const wallet = getSellerWallet();
      setBalance(wallet.balance);
      setWithdrawals(wallet.withdrawals);
    };

    refresh();
    window.addEventListener(WALLET_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(WALLET_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const applyPercent = (percent: number) => {
    setAmount(Math.floor((balance * percent) / 100));
    setFeedback(null);
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const selected = BANK_METHODS.find((item) => item.id === method);
      const result = requestWithdrawal({
        amount,
        methodId: method,
        methodLabel: selected?.label ?? method,
      });

      if (result.ok) {
        setBalance(result.balance);
        setWithdrawals((prev) => [result.record, ...prev]);
        setAmount(0);
        setFeedback({
          type: 'success',
          message: `Permintaan penarikan ${formatRupiah(result.record.amount)} ke ${result.record.methodLabel} sedang diproses.`,
        });
      } else {
        setFeedback({ type: 'error', message: result.error });
      }
    },
    [amount, method]
  );

  return (
    <SellerShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
          Dashboard Penjual
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-forest-900">
          Penarikan Dana
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-sage-500">
          <Wallet className="h-3.5 w-3.5" />
          Cairkan saldo hasil penjualan menu surplus tokomu.
        </p>
      </motion.div>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="space-y-5 lg:col-span-5 lg:space-y-6">
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-500">
              Saldo Bisa Dicairkan
            </p>
            <p className="mt-2 font-display text-[34px] font-medium leading-none tracking-tight text-forest-900">
              {formatRupiah(balance)}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="withdraw-amount"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-900"
                >
                  Nominal Penarikan
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-sage-500">
                    Rp
                  </span>
                  <input
                    id="withdraw-amount"
                    type="number"
                    min={0}
                    max={balance}
                    value={amount || ''}
                    onChange={(event) => {
                      setAmount(Number(event.target.value) || 0);
                      setFeedback(null);
                    }}
                    placeholder={WITHDRAWAL_MIN.toLocaleString('id-ID')}
                    className="w-full rounded-xl border border-sage-100 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-charcoal-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[25, 50, 100].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => applyPercent(percent)}
                      className="rounded-full bg-cream-50 px-3 py-1.5 text-[11px] font-semibold text-charcoal-900 transition-colors hover:bg-sage-100"
                    >
                      {percent}% Saldo
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-900">
                  Rekening Tujuan
                </p>
                <div className="grid gap-2">
                  {BANK_METHODS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      aria-pressed={method === item.id}
                      className={cn(
                        'flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors',
                        method === item.id
                          ? 'border-green-700 bg-green-700/5 text-charcoal-900'
                          : 'border-sage-100 bg-white text-charcoal-500 hover:border-green-700'
                      )}
                    >
                      {item.label}
                      {method === item.id && (
                        <BadgeCheck className="h-4 w-4 text-green-700" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {feedback && (
                <p
                  role="status"
                  className={cn(
                    'inline-flex items-start gap-1.5 rounded-lg px-3 py-2 text-xs font-medium',
                    feedback.type === 'success'
                      ? 'bg-green-700/10 text-green-700'
                      : 'bg-gold-100 text-charcoal-900'
                  )}
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {feedback.message}
                </p>
              )}

              <button
                type="submit"
                disabled={balance <= 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Tarik Dana
              </button>
              <p className="text-[11px] text-sage-500">
                Minimal penarikan Rp{WITHDRAWAL_MIN.toLocaleString('id-ID')}. Mode demo — dana
                disimulasikan di perangkat ini.
              </p>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card>
            <h2 className="text-sm font-bold text-charcoal-900">
              Riwayat Penarikan ({withdrawals.length})
            </h2>

            {withdrawals.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-sage-100 bg-cream-50/70 p-6 text-center text-xs leading-relaxed text-sage-500">
                Belum ada penarikan. Ajukan penarikan pertamamu lewat form di samping.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-sage-100">
                {withdrawals.map((record) => (
                  <li
                    key={record.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-charcoal-900">
                        {formatRupiah(record.amount)}
                      </p>
                      <p className="mt-0.5 text-xs text-sage-500">
                        {record.methodLabel} · {formatOrderDate(record.requestedAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gold-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                      Diproses
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </SellerShell>
  );
}
