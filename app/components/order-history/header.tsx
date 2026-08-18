'use client';

import { Bell, CircleHelp, ChevronDown, Menu, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';

type HeaderProps = {
  onOpenMenu: () => void;
};

export function OrderHeader({ onOpenMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-pine/10 bg-cream/80 backdrop-blur-md">
      <div className="flex items-center gap-3 px-5 py-4 sm:px-8">
        <button
          aria-label="Open menu"
          onClick={onOpenMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pine/15 bg-white text-pine transition-colors hover:bg-mint lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <label className="relative hidden w-full max-w-md flex-1 items-center sm:flex">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-moss" />
          <input
            type="search"
            placeholder="Search rescued food or merchants"
            className="h-11 w-full rounded-full border border-pine/10 bg-white pl-11 pr-4 text-sm text-ink placeholder:text-moss/70 outline-none transition-all focus:border-leaf focus:ring-4 focus:ring-leaf/15"
          />
        </label>

        <div className="ml-auto flex items-center gap-2.5 sm:ml-0">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pine/10 bg-white text-pine transition-colors hover:bg-mint"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-terra ring-2 ring-white animate-pulse-dot" />
          </button>

          <button
            type="button"
            aria-label="Help"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pine/10 bg-white text-pine transition-colors hover:bg-mint"
          >
            <CircleHelp className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2.5">
            <Avatar className="h-11 w-11 border-2 border-leaf/40 ring-2 ring-mint">
              <AvatarImage
                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop"
                alt="Michael Johnson"
              />
              <AvatarFallback className="bg-pine font-display text-sm text-white">
                MJ
              </AvatarFallback>
            </Avatar>
            <div className="hidden leading-tight lg:block">
              <p className="text-sm font-semibold text-ink">Michael Johnson</p>
              <p className="text-xs text-moss">Eco member</p>
            </div>
            <button
              type="button"
              aria-label="Profile menu"
              className="hidden h-8 w-8 items-center justify-center rounded-full text-moss transition-colors hover:bg-mint hover:text-pine sm:flex"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
