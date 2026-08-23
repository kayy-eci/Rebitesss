import Link from 'next/link';
import { Plus, ShoppingBag, Wallet } from 'lucide-react';

const actions = [
  { label: 'Tambah Menu', icon: Plus, href: '/dashboard/penjual/tambahMenu' },
  { label: 'Pesanan Masuk', icon: ShoppingBag, href: '/dashboard/penjual/pesanan' },
  { label: 'Pencairan Dana', icon: Wallet, href: '/dashboard/penjual/penarikan' },
] as const;

type Action = (typeof actions)[number];

function ActionContent({ action }: { action: Action }) {
  const Icon = action.icon;
  return (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-green-700 transition-colors group-hover:bg-sage-100/70">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-center text-[11px] font-medium text-charcoal-900">
        {action.label}
      </span>
    </>
  );
}

export function QuickActionsRow() {
  return (
    <div className="mt-5 grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          aria-label={action.label}
          className="group flex flex-col items-center gap-1.5"
        >
          <ActionContent action={action} />
        </Link>
      ))}
    </div>
  );
}
