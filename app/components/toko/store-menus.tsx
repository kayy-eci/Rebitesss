import Link from 'next/link';
import { ArrowRight, Utensils } from 'lucide-react';
import { StoreMenuCard } from './store-menu-card';
import { STORE_MENUS } from './data';

export function StoreMenus() {
  return (
    <section id="menu-surplus" className="mt-12 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Menu Surplus
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-medium tracking-tight text-primary sm:text-3xl">
            Menu Surplus Hari Ini
          </h2>
          <p className="mt-1.5 text-sm text-sage-500">
            Hemat hingga 50% dan selamatkan {STORE_MENUS.length} menu dari terbuang.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STORE_MENUS.map((menu) => (
          <StoreMenuCard key={menu.id} menu={menu} />
        ))}

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-sage-100 bg-cream-50 p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-sm">
            <Utensils className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-bold text-charcoal-900">
              Menu Saya Lengkap di Toko
            </p>
            <p className="mt-1 text-xs leading-relaxed text-sage-500">
              Jelajahi seluruh menu & jadwal ketersediaan {STORE_MENUS.length} porsi surplus
              lainnya di toko ini.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-caramel hover:text-white"
          >
            Lihat Semua Menu
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
