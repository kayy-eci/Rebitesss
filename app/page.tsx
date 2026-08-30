"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Quote } from "lucide-react";
import { SmoothScroll } from "@/app/components/smooth-scroll";
import { Preloader } from "@/app/components/preloader";
import { SiteFooter } from "@/app/components/site-footer";
import { Reveal, RevealWords } from "@/app/components/reveal";
import { Marquee } from "@/app/components/marquee";
import HowItWorks from "@/app/components/HowItWorks";
import { UrgentDealsSection } from "@/app/components/UrgentDealsSection";
import { FlashSaleSection } from "@/app/components/FlashSaleSection";
import { ProductDetailModal } from "@/app/components/ProductDetailModalLazy";
import { useProductDetail } from "@/app/detail/product/use-product-detail";
import { HeroSection } from "@/app/components/hero-section";
import { HeroFoodCarousel } from "@/app/components/hero-food-carousel";
import { SubscriptionSection } from "@/app/components/subscription/subscription-section";
import { FaqSection } from "@/app/components/faq-section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/app/components/ui/carousel";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/avatar";
import { fetchVendors } from "@/lib/catalog";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
  photo: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rina Astuti",
    role: "Pemilik Dapur Ibu Sri",
    quote:
      "Awalnya coba-coba daftar Trial karena penasaran. Ternyata kepake banget. Makanan yang biasanya masih sisa sekarang lebih cepat habis, dan laporan penjualannya juga gampang dipahami.",
    rating: 5,
    initials: "RA",
    photo:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Arga Zanuar",
    role: "Pembeli setia",
    quote:
      "Sekarang kalau jam makan siang biasanya cek ReBites dulu. Harganya lebih hemat, tapi makanannya tetap enak dan kondisinya juga oke. Lumayan banget buat sehari-hari.",
    rating: 5,
    initials: "BS",
    photo:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Dewi Lestari",
    role: "Kue Mbok Darmi",
    quote:
      "Sejak pakai paket Standar, produk saya jadi lebih sering dilihat orang. Ada beberapa pembeli baru yang awalnya nemu dari ReBites, jadi lumayan banget buat kenalin usaha juga.",
    rating: 5,
    initials: "DL",
    photo:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Abdurrahman Kaysan",
    role: "Pelanggan rutin",
    quote:
      "Paling sering pesen kalau lagi males keluar rumah. Soto Mie Bogornya enak, harganya juga nggak bikin mikir dua kali. Udah beberapa kali beli dan sejauh ini selalu puas.",
    rating: 5,
    initials: "AF",
    photo:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Mang Teten",
    role: "Warung Mang Teten",
    quote:
      "Dulu kalau ada makanan yang nggak habis biasanya bingung mau diapain. Sekarang bisa ditawarkan lewat ReBites. Lumayan, makanan nggak kebuang dan masih bisa jadi tambahan pemasukan.",
    rating: 5,
    initials: "SW",
    photo:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Falen Darmawan",
    role: "Mahasiswa",
    quote:
      "Sebagai anak kos, ReBites cukup ngebantu sih. Bisa dapet makanan yang masih bagus dengan harga lebih murah. Biasanya sebelum beli makan saya cek sini dulu.",
    rating: 5,
    initials: "RP",
    photo:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
];

const FALLBACK_STORES = [
  "Dapur Ibu Sri",
  "Kue Mbok Darmi",
  "Warung Mang Teten",
  "Soto Mie Bogor",
  "Kopi Nusantara",
  "Bakso Pak Joko",
  "Ayam Geprek Sambal",
  "Es Teh Segar",
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [testimonialApi, setTestimonialApi] = useState<CarouselApi>();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialPaused = useRef(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  // Nama mitra diambil langsung dari daftar toko di database.
  const [partners, setPartners] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    fetchVendors().then((vendors) => {
      if (active) setPartners(vendors.map((v) => v.name).filter(Boolean));
    });
    return () => {
      active = false;
    };
  }, []);

  const handleViewDetail = (id: string) => {
    setSelectedProductId(id);
  };

  const handleCloseModal = () => {
    setSelectedProductId(null);
  };

  const selectedProduct = useProductDetail(selectedProductId);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      document.body.style.overflow = "";
    }
  }, [loaded]);

  useEffect(() => {
    if (!testimonialApi) return;

    const onSelect = () =>
      setActiveTestimonial(testimonialApi.selectedScrollSnap());

    onSelect();
    testimonialApi.on("select", onSelect);
    testimonialApi.on("reInit", onSelect);

    return () => {
      testimonialApi.off("select", onSelect);
      testimonialApi.off("reInit", onSelect);
    };
  }, [testimonialApi]);

  // Auto-play carousel testimoni setiap 5 detik, pause saat hover.
  useEffect(() => {
    if (!testimonialApi || !testimonialApi.canScrollNext()) return;

    const interval = setInterval(() => {
      if (!testimonialPaused.current) {
        testimonialApi.scrollNext();
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [testimonialApi]);

  return (
    <SmoothScroll>
      <Preloader onDone={() => setLoaded(true)} />
      <div className="flex min-h-screen flex-col">
        <div id="top" className="flex flex-1 flex-col">
          <HeroSection />
        </div>

        {(() => {
          const stores = partners.length > 0 ? partners : FALLBACK_STORES;
          return (
            <section
              data-nav="cream"
              aria-label="Mitra ReBites"
              className="border-y border-hairline bg-cream py-5 lg:py-6"
            >
              <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <Marquee pauseOnHover>
                  {stores.map((p, i) => (
                    <span
                      key={i}
                      className="mx-6 flex items-center font-display text-lg font-light tracking-tight text-forest-dark/45 lg:text-xl"
                    >
                      {p}
                      <span
                        aria-hidden
                        className="ml-6 h-1 w-1 rounded-full bg-caramel/70"
                      />
                    </span>
                  ))}
                </Marquee>
              </div>
            </section>
          );
        })()}
      </div>

      <HeroFoodCarousel />

      <FlashSaleSection onViewDetail={handleViewDetail} />

      <UrgentDealsSection onViewDetail={handleViewDetail} />

      <section
        id="about"
        data-nav="cream"
        className="grain-overlay relative overflow-hidden bg-cream py-16 lg:py-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-primary/[0.06] blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute right-20 top-32 h-32 w-32 rounded-full border border-caramel/40"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <Reveal delay={0.15}>
                <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.02] tracking-[-0.02em] text-forest-dark">
                  <RevealWords text="Bukan sekadar" />{" "}
                  <RevealWords text="menyelamatkan" />{" "}
                  <RevealWords text="makanan." />
                </h2>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-6 max-w-lg font-sans text-sm leading-[1.85] text-muted-foreground">
                  <span className="font-semibold text-caramel">ReBites</span>{" "}
                  hadir sebagai marketplace makanan surplus yang mempertemukan
                  pelaku UMKM dengan masyarakat. Makanan yang sebelumnya
                  berpotensi terbuang dapat kembali memiliki nilai, sementara
                  pelaku usaha memperoleh peluang tambahan pendapatan dan
                  pembeli mendapatkan makanan berkualitas dengan harga yang
                  lebih terjangkau.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <p className="mt-4 max-w-lg font-sans text-sm leading-[1.85] text-muted-foreground">
                  Saat ini{" "}
                  <span className="font-semibold text-caramel">ReBites</span>{" "}
                  beroperasi khusus di{" "}
                  <span className="font-semibold text-caramel">
                    Kota Depok
                  </span>
                  , sebagai langkah awal membangun ekosistem penyelamatan
                  makanan berbasis komunitas sebelum meluas ke kota lain.
                </p>
              </Reveal>
            </div>

            <div className="flex flex-col gap-6">
              <Reveal delay={0.15}>
                <h3 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-light leading-[1.1] tracking-[-0.02em] text-forest-dark">
                  Untuk <span className="text-caramel">UMKM</span>. Untuk{" "}
                  <span className="text-caramel">masyarakat</span>. Untuk{" "}
                  <span className="text-caramel">lingkungan</span>.
                </h3>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    num: "01",
                    title: "UMKM",
                    desc: "Memberi peluang tambahan pendapatan dari makanan surplus yang masih layak konsumsi.",
                  },
                  {
                    num: "02",
                    title: "Masyarakat",
                    desc: "Memudahkan menemukan makanan berkualitas dengan harga yang lebih terjangkau.",
                  },
                  {
                    num: "03",
                    title: "Lingkungan",
                    desc: "Membantu mengurangi potensi food waste dengan memperpanjang pemanfaatan makanan.",
                  },
                ].map((item, i) => (
                  <Reveal key={item.num} delay={0.2 + i * 0.08}>
                    <div className="group flex h-full cursor-pointer flex-col rounded-[var(--radius)] border border-border bg-white p-6 shadow-[0_10px_30px_-24px_rgba(27,77,50,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-caramel sm:p-7">
                      <span className="font-sans text-sm italic tracking-[0.2em] text-caramel">
                        {item.num}
                      </span>

                      <h3 className="mt-4 font-sans text-xl font-semibold tracking-tight text-forest-dark">
                        {item.title}
                      </h3>

                      <p className="mt-3 font-sans text-sm leading-[1.8] text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <SubscriptionSection />

<section
        id="testimoni"
        data-nav="green"
        className="grain-overlay relative overflow-hidden bg-primary py-16 lg:py-20"
      >
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary-foreground/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary-foreground">
                  <RevealWords text="Apa kata mereka setelah" />{" "}
                  <span>menggunakan</span> ReBites.
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-primary-foreground/70 lg:mx-0">
                  Pengalaman dari UMKM dan pembeli yang sudah menemukan cara
                  baru untuk menjual, membeli, dan menikmati makanan dengan
                  lebih hemat.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.1}>
            <div
              className="relative mt-12 lg:mt-16"
              onMouseEnter={() => {
                testimonialPaused.current = true;
              }}
              onMouseLeave={() => {
                testimonialPaused.current = false;
              }}
            >
              <button
                type="button"
                onClick={() => testimonialApi?.scrollPrev()}
                aria-label="Testimoni sebelumnya"
                className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_10px_30px_-24px_rgba(27,77,50,0.3)] transition-all duration-300 hover:-translate-y-1/2 hover:border-caramel hover:bg-caramel hover:text-white sm:flex"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>

              <button
                type="button"
                onClick={() => testimonialApi?.scrollNext()}
                aria-label="Testimoni berikutnya"
                className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_10px_30px_-24px_rgba(27,77,50,0.3)] transition-all duration-300 hover:-translate-y-1/2 hover:border-caramel hover:bg-caramel hover:text-white sm:flex"
              >
                <ArrowRight className="h-4 w-4" />
              </button>

              <Carousel
                opts={{ align: "start", loop: true }}
                setApi={setTestimonialApi}
              >
                <CarouselContent className="-ml-4 lg:-ml-5">
                  {TESTIMONIALS.map((t, i) => (
                    <CarouselItem
                      key={t.name}
                      className="basis-full pl-4 sm:basis-1/2 sm:pl-4 lg:basis-1/3 lg:pl-5"
                    >
                      <div className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-white p-8 shadow-[0_10px_30px_-24px_rgba(27,77,50,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-caramel/40 hover:shadow-[0_30px_60px_-28px_rgba(27,77,50,0.35)] lg:p-9">
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -top-3 right-4 select-none font-display text-[6rem] font-extralight leading-none text-caramel/[0.08] transition-colors duration-300 group-hover:text-caramel/15"
                        >
                          &ldquo;
                        </span>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: t.rating }).map((_, s) => (
                            <Star
                              key={s}
                              className="h-4 w-4 fill-amber text-amber"
                            />
                          ))}
                        </div>

                        <Quote className="mt-5 h-5 w-5 text-caramel/40" />

                        <blockquote className="mt-3 flex-1 font-sans text-sm leading-relaxed text-foreground/80">
                          &ldquo;{t.quote}&rdquo;
                        </blockquote>

                        <div className="relative mt-7 flex items-center gap-3 pt-6">
                          <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-px"
                            style={{
                              background:
                                "repeating-linear-gradient(90deg, currentColor 0 5px, transparent 5px 10px)",
                              opacity: 0.35,
                            }}
                          />

                          <Avatar className="h-11 w-11 border border-caramel/30">
                            <AvatarImage
                              src={t.photo}
                              alt={t.name}
                              className="object-cover"
                            />

                            <AvatarFallback className="bg-caramel font-display text-sm font-medium text-white">
                              {t.initials}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-display text-base font-medium text-primary">
                              {t.name}
                            </p>

                            <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                              {t.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex justify-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  aria-label={`Ke testimoni ${i + 1}`}
                  onClick={() => testimonialApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === i
                      ? "w-8 bg-primary-foreground"
                      : "w-1.5 bg-primary-foreground/25 hover:bg-primary-foreground/50"
                  }`}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection />

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      <SiteFooter />
    </SmoothScroll>
  );
}
