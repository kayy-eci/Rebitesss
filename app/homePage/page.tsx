import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { ExploreSection } from "@/app/components/ExploreSection";
import { UrgentDealsSection } from "@/app/components/UrgentDealsSection";
import { VendorSection } from "@/app/components/VendorSection";
import { SiteFooter } from "@/app/components/Footer";
import { Badge } from "@/app/components/Badge";
import { Reveal } from "@/app/components/reveal";
import { MagneticButton } from "@/app/components/magnetic-button";
import {
  ArrowRight,
  Check,
  MapPin,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="bg-cream-50">
        <Hero />
        <ExploreSection />
        <UrgentDealsSection />
        <VendorSection />
        <section
          id="umkm"
          className="grain-overlay relative overflow-hidden bg-secondary py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Reveal>
                  <Badge variant="outline" className="mb-5">
                    03 - Untuk UMKM
                  </Badge>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                    Kelola surplus, tambah pemasukan.
                  </h2>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-foreground/70">
                    Alat yang dirancang khusus untuk pelaku kuliner skala kecil.
                    Kelola produk, stok, pesanan, dan langganan dari satu
                    dasbor.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="mt-8 flex items-center gap-4 rounded-[var(--radius)] border border-primary/15 bg-background p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground-strong">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-medium text-primary">
                        Trial gratis 1 bulan
                      </p>
                      <p className="font-sans text-xs text-muted-foreground">
                        Tanpa kartu kredit. Batalkan kapan saja.
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.35}>
                  <div className="mt-8">
                    <MagneticButton href="/register" variant="default">
                      Daftar sebagai UMKM
                      <ArrowRight className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </Reveal>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Store,
                    title: "Profil usaha",
                    desc: "Kelola nama, deskripsi, logo, dan lokasi dapur yang terlihat di marketplace.",
                  },
                  {
                    icon: ShoppingCart,
                    title: "Stok, harga & status",
                    desc: "Atur stok harian, harga surplus, status ketersediaan, dan waktu jual.",
                  },
                  {
                    icon: Sparkles,
                    title: "Langganan dengan trial",
                    desc: "Coba 1 bulan gratis, lalu pilih paket sesuai skala usaha.",
                  },
                  {
                    icon: Check,
                    title: "Kelola pesanan masuk",
                    desc: "Terima, proses, dan tandai pesanan siap diambil atau dikirim.",
                  },
                  {
                    icon: TrendingDown,
                    title: "Riwayat penjualan",
                    desc: "Pantau performa produk dan pemasukan dari makanan yang diselamatkan.",
                  },
                  {
                    icon: MapPin,
                    title: "Peta pickup",
                    desc: "Tampilkan titik lokasi agar pembeli mudah menemukan dapur Anda.",
                  },
                ].map((f, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <div className="group h-full rounded-[var(--radius)] border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_-20px_hsl(var(--primary)/0.3)]">
                      <f.icon className="h-6 w-6 text-primary/50 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary" />
                      <h3 className="mt-5 font-display text-lg font-medium text-primary">
                        {f.title}
                      </h3>
                      <p className="mt-2 font-sans text-[13px] leading-relaxed text-muted-foreground">
                        {f.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
