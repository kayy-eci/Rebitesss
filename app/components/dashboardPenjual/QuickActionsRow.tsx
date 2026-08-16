import Link from 'next/link';
import { Plus, Clock, Wallet, MoreHorizontal } from 'lucide-react';

const actions = [
  { label: 'Tambah Menu', icon: Plus, href: '/dashboardPenjual/tambahMenu' },
  { label: 'Jadwal Buka', icon: Clock },
  { label: 'Pencairan Dana', icon: Wallet },
  { label: 'Lainnya', icon: MoreHorizontal },
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
    <div className="mt-5 grid grid-cols-4 gap-3">
      {actions.map((action) =>
        'href' in action ? (
          <Link
            key={action.label}
            href={action.href}
            aria-label={action.label}
            className="group flex flex-col items-center gap-1.5"
          >
            <ActionContent action={action} />
          </Link>
        ) : (
          <button
            key={action.label}
            type="button"
            aria-label={action.label}
            className="group flex flex-col items-center gap-1.5"
          >
            <ActionContent action={action} />
          </button>
        )
      )}
    </div>
  );
}
