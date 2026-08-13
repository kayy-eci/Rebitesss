import { CartProvider } from './lib/cart-store';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExploreSection } from './components/ExploreSection';
import { UrgentDealsSection } from './components/UrgentDealsSection';
import { VendorSection } from './components/VendorSection';
import { BenefitsSection } from './components/BenefitsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ImpactStatsSection } from './components/ImpactStatsSection';
import { VendorCTASection } from './components/VendorCTASection';
import { Footer } from './components/Footer';

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
