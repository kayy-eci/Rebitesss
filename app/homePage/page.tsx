import { CartProvider } from '@/lib/cart-store';
import { Navbar } from '@/app/components/Navbar';
import { Hero } from '@/app/components/Hero';
import { ExploreSection } from '@/app/components/ExploreSection';
import { UrgentDealsSection } from '@/app/components/UrgentDealsSection';
import { VendorSection } from '@/app/components/VendorSection';
import { BenefitsSection } from '@/app/components/BenefitsSection';
import { HowItWorksSection } from '@/app/components/HowItWorksSection';
import { ImpactStatsSection } from '@/app/components/ImpactStatsSection';
import { VendorCTASection } from '@/app/components/VendorCTASection';
import { Footer } from '@/app/components/Footer';

export default function HomePage() {
  return (
    <CartProvider>
      <Navbar />
      <main className="bg-cream-50">
        <Hero />
        <ExploreSection />
        <UrgentDealsSection />
        <VendorSection />
        <BenefitsSection />
        <HowItWorksSection />
        <ImpactStatsSection />
        <VendorCTASection />
      </main>
      <Footer />
    </CartProvider>
  );
}
