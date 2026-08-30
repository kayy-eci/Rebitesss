"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Beranda", icon: Home },
  { href: "/cari", label: "Cari", icon: Search },
  { href: "/riwayatPesanan", label: "Pesanan", icon: ShoppingBag },
  { href: "/profile", label: "Profil", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/home") return pathname === "/home" || pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-100 bg-white/95 backdrop-blur-lg safe-area-pb lg:hidden"
      aria-label="Navigasi bawah"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-charcoal-500 hover:text-charcoal-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-primary" : "text-charcoal-500"
                )}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
