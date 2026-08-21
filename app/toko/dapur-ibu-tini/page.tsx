import { StoreHeader } from '@/app/components/toko/store-header';
import { StoreHero } from '@/app/components/toko/store-hero';
import { StoreStats } from '@/app/components/toko/store-stats';
import { StoreAbout } from '@/app/components/toko/store-about';
import { StoreMenus } from '@/app/components/toko/store-menus';
import { StoreReviews } from '@/app/components/toko/store-reviews';
import { SiteFooter } from '@/app/components/site-footer';

export default function StoreProfilePage() {
  return (
    <main className="min-h-screen bg-cream-50 font-sans text-charcoal-900">
      <StoreHeader />
      <StoreHero />
      <div className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-8">
        <StoreStats />
        <StoreAbout />
        <StoreMenus />
        <StoreReviews />
      </div>
      <SiteFooter />
    </main>
  );
}
