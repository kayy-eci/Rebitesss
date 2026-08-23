'use client';

import { Bell, CircleHelp, Menu, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { getCurrentUser } from '@/lib/current-user';

type HeaderProps = {
  onOpenMenu: () => void;
};

export function OrderHeader({ onOpenMenu }: HeaderProps) {
  const user = getCurrentUser();
  const displayName = user.fullName || user.email || 'Tamu';
  const initials = (user.fullName || user.email || '?')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-cream-50/80 backdrop-blur-md">
      <div className="flex items-center gap-3 px-5 py-4 sm:px-8">
        <button
          aria-label="Buka menu"
          onClick={onOpenMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-white text-green-700 transition-colors hover:bg-green-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <label className="relative hidden w-full max-w-md flex-1 items-center sm:flex">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-charcoal-500" />
          <input
            type="search"
            placeholder="Cari makanan surplus atau toko…"
            className="h-11 w-full rounded-full border border-hairline bg-white pl-11 pr-4 text-sm text-charcoal-900 placeholder:text-charcoal-500/60 outline-none transition-all focus:border-sage-500 focus:ring-4 focus:ring-green-50"
          />
        </label>

        <div className="ml-auto flex items-center gap-2.5 sm:ml-0">
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-white text-green-700 transition-colors hover:bg-green-50"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-500 ring-2 ring-white" />
          </button>

          <button
            type="button"
            aria-label="Bantuan"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-white text-green-700 transition-colors hover:bg-green-50 sm:flex"
          >
            <CircleHelp className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2.5">
            <Avatar className="h-11 w-11 border-2 border-sage-500/40 ring-2 ring-green-50">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-green-700 font-display text-sm text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden leading-tight lg:block">
              <p className="max-w-[160px] truncate text-sm font-semibold text-charcoal-900">
                {displayName}
              </p>
              <p className="text-xs text-charcoal-500">Pembeli ReBites</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
