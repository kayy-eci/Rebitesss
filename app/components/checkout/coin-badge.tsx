'use client';

import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRebitesCoins } from '@/hooks/use-rebites-coins';

/**
 * Badge saldo ReBites Coin — reusable untuk navbar, sidebar, dll.
 */
export function CoinBadge({ className }: { className?: string }) {
  const { balance } = useRebitesCoins();

  return (
    <span
      role="status"
      aria-label={`Saldo ReBites Coin: ${balance.toLocaleString('id-ID')} Coin`}
      title="Saldo ReBites Coin"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-100 px-3 py-1.5 text-xs font-bold tabular-nums text-gold-600 shadow-sm',
        className
      )}
    >
      <Coins className="h-3.5 w-3.5" />
      {balance.toLocaleString('id-ID')}
    </span>
  );
}
