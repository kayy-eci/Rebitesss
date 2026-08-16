import { Plus, Clock, Wallet, MoreHorizontal } from 'lucide-react';

const actions = [
  { label: 'Tambah Menu', icon: Plus },
  { label: 'Jadwal Buka', icon: Clock },
  { label: 'Pencairan Dana', icon: Wallet },
  { label: 'Lainnya', icon: MoreHorizontal },
];

export function QuickActionsRow() {
  return (
    <div className="mt-5 grid grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            aria-label={action.label}
            className="group flex flex-col items-center gap-1.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-green-700 transition-colors group-hover:bg-sage-100/70">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-center text-[11px] font-medium text-charcoal-900">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
