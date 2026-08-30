"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSellerStatus } from "@/hooks/use-seller-status";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSeller } = useSellerStatus();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/home") return pathname === "/home" || pathname === "/";
    return pathname.startsWith(href);
  };

  const handleTokoSaya = () => {
    if (isSeller) {
      router.push("/dashboard/penjual");
    } else {
      router.push("/auth/register/penjual");
    }
  };

  const isTokoActive = pathname?.startsWith("/dashboard/penjual") || pathname?.startsWith("/auth/register/penjual");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-100 bg-white/95 backdrop-blur-lg lg:hidden"
      aria-label="Navigasi bawah"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        <Link
          href="/home"
          aria-current={isActive("/home") ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors",
            isActive("/home")
              ? "text-primary"
              : "text-charcoal-500 hover:text-charcoal-900"
          )}
        >
          <Home
            className={cn("h-5 w-5", isActive("/home") ? "text-primary" : "text-charcoal-500")}
            strokeWidth={isActive("/home") ? 2.2 : 1.8}
          />
          <span>Beranda</span>
        </Link>

        <button
          type="button"
          onClick={handleTokoSaya}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors",
            isTokoActive
              ? "text-primary"
              : "text-charcoal-500 hover:text-charcoal-900"
          )}
        >
          {isSeller ? (
            <LayoutGrid
              className={cn("h-5 w-5", isTokoActive ? "text-primary" : "text-charcoal-500")}
              strokeWidth={isTokoActive ? 2.2 : 1.8}
            />
          ) : (
            <Store
              className={cn("h-5 w-5", isTokoActive ? "text-primary" : "text-charcoal-500")}
              strokeWidth={isTokoActive ? 2.2 : 1.8}
            />
          )}
          <span>{isSeller ? "Toko Saya" : "Jualan"}</span>
        </button>

        <Link
          href="/riwayatPesanan"
          aria-current={isActive("/riwayatPesanan") ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors",
            isActive("/riwayatPesanan")
              ? "text-primary"
              : "text-charcoal-500 hover:text-charcoal-900"
          )}
        >
          <ShoppingBag
            className={cn("h-5 w-5", isActive("/riwayatPesanan") ? "text-primary" : "text-charcoal-500")}
            strokeWidth={isActive("/riwayatPesanan") ? 2.2 : 1.8}
          />
          <span>Pesanan</span>
        </Link>

        <Link
          href="/profile"
          aria-current={isActive("/profile") ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors",
            isActive("/profile")
              ? "text-primary"
              : "text-charcoal-500 hover:text-charcoal-900"
          )}
        >
          <User
            className={cn("h-5 w-5", isActive("/profile") ? "text-primary" : "text-charcoal-500")}
            strokeWidth={isActive("/profile") ? 2.2 : 1.8}
          />
          <span>Profil</span>
        </Link>
      </div>
    </nav>
  );
}
