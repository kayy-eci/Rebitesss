"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  Leaf,
  MapPin,
  Quote,
  Search,
  SearchX,
  ShoppingCart,
  Star,
  Store,
  Utensils,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/app/components/Badge";
import { SmartImage } from "@/app/components/SmartImage";
import { foodItems, formatRupiah, urgentItems, vendors } from "@/lib/data";
import type { FoodItem, Vendor } from "@/lib/types";
import { SiteFooter } from "@/app/components/site-footer";
import { ProductDetailModal } from "@/app/components/ProductDetailModal";
import { getProductById } from "@/app/detail/product/data";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/app/components/ui/carousel";

/* ─── Data Helpers ─── */
function getVendorFoods(vendorName: string): FoodItem[] {
  const merged: FoodItem[] = [
    ...foodItems.filter((item) => item.vendorName === vendorName),
    ...urgentItems.filter((item) => item.vendorName === vendorName),
  ];

  const seen = new Set<string>();

  return merged.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseStock(label: string): number | null {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function isOpenNow(openHours: string): boolean {
  const match = openHours.match(
    /(\d{1,2})\.(\d{2})\s*[–-]\s*(\d{1,2})\.(\d{2})/,
  );
  if (!match) return true;

  const open = Number(match[1]) * 60 + Number(match[2]);
  const close = Number(match[3]) * 60 + Number(match[4]);
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  return open <= close
    ? minutes >= open && minutes < close
    : minutes >= open || minutes < close;
}

/* ─── Review Pelanggan tentang Pelayanan Toko ─── */
interface ServiceReview {
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

const pexelsAvatar = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop`;

const SERVICE_REVIEWS: Record<string, ServiceReview[]> = {
  "warung-nusantara": [
    {
      name: "Andi Pratama",
      avatar: pexelsAvatar(220453),
      rating: 5,
      comment:
        "Pelayanannya ramah dan proses pengambilan makanan cepat, tidak perlu antre lama.",
      timeAgo: "2 hari lalu",
    },
    {
      name: "Siti Rahma",
      avatar: pexelsAvatar(774909),
      rating: 4,
      comment:
        "Staff cukup ramah dan pesanannya sudah disiapkan dengan baik sesuai jadwal.",
      timeAgo: "5 hari lalu",
    },
    {
      name: "Budi Santoso",
      avatar: pexelsAvatar(1222271),
      rating: 5,
      comment:
        "Packing rapi, makanan masih hangat waktu diambil. Komunikasinya juga enak.",
      timeAgo: "1 minggu lalu",
    },
    {
      name: "Dewi Lestari",
      avatar: pexelsAvatar(415829),
      rating: 4,
      comment:
        "Admin responsif membalas chat, cuma waktu tunggu agak lama saat jam sibuk.",
      timeAgo: "1 minggu lalu",
    },
    {
      name: "Rizky Maulana",
      avatar: pexelsAvatar(614810),
      rating: 3,
      comment:
        "Rasa konsisten dan staff membantu, tapi tanda antrean pengambilan kurang jelas.",
      timeAgo: "2 minggu lalu",
    },
  ],
  "dapur-ibu-tini": [
    {
      name: "Maya Anggraini",
      avatar: pexelsAvatar(1130626),
      rating: 5,
      comment:
        "Bu Tini sangat ramah, pesanan selalu sudah siap tepat jadwal pengambilan.",
      timeAgo: "1 hari lalu",
    },
    {
      name: "Fajar Nugroho",
      avatar: pexelsAvatar(2379004),
      rating: 4,
      comment:
        "Proses pengambilan cepat, kemasan dibungkus rapi dan aman dibawa jauh.",
      timeAgo: "3 hari lalu",
    },
    {
      name: "Intan Permata",
      avatar: pexelsAvatar(1239291),
      rating: 5,
      comment:
        "Staff responsif banget membalas chat, pengalaman ambil pesanan lancar.",
      timeAgo: "4 hari lalu",
    },
    {
      name: "Hendra Wijaya",
      avatar: pexelsAvatar(1043471),
      rating: 3,
      comment:
        "Masakannya enak, hanya saja saya sempat menunggu agak lama saat jam makan siang.",
      timeAgo: "1 minggu lalu",
    },
    {
      name: "Ratna Sari",
      avatar: pexelsAvatar(733872),
      rating: 4,
      comment:
        "Pelayanan hangat dan sabar menjawab pertanyaan soal menu surplus hari itu.",
      timeAgo: "2 minggu lalu",
    },
  ],
  "warkop-pak-iman": [
    {
      name: "Dimas Prasetyo",
      avatar: pexelsAvatar(91227),
      rating: 5,
      comment:
        "Pak Iman ramah, pesanan kopi dan snack selalu siap sebelum jadwal ambil.",
      timeAgo: "1 hari lalu",
    },
    {
      name: "Nadia Putri",
      avatar: pexelsAvatar(762020),
      rating: 4,
      comment:
        "Staff gerak cepat meski lagi ramai, packing minuman aman tidak tumpah.",
      timeAgo: "4 hari lalu",
    },
    {
      name: "Yusuf Hidayat",
      avatar: pexelsAvatar(1681010),
      rating: 5,
      comment:
        "Komunikasinya baik sekali, salah pesan langsung diganti tanpa ribet.",
      timeAgo: "6 hari lalu",
    },
    {
      name: "Lina Marlina",
      avatar: pexelsAvatar(1858175),
      rating: 3,
      comment:
        "Menu standarnya enak, tapi antreannya lumayan panjang kalau pagi hari.",
      timeAgo: "1 minggu lalu",
    },
    {
      name: "Agus Setiawan",
      avatar: pexelsAvatar(1516680),
      rating: 4,
      comment:
        "Titik pengambilan jelas dan staff membantu carikan pesanan dengan cepat.",
      timeAgo: "2 minggu lalu",
    },
  ],
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function StoreServiceReviews({ vendor }: { vendor: Vendor }) {
  const reviews = SERVICE_REVIEWS[vendor.id] ?? [];
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => setActiveIndex(carouselApi.selectedScrollSnap());

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  return (
    <>
      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
          Review Pelanggan
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-medium tracking-tight text-forest-900 sm:text-3xl">
          Kata Pelanggan tentang Pelayanan {vendor.name}
        </h2>
      </div>

      <div className="relative mt-6">
        <button
          type="button"
          onClick={() => carouselApi?.scrollPrev()}
          aria-label="Review sebelumnya"
          className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1/2 hover:border-caramel hover:bg-caramel hover:text-white sm:flex"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>

        <button
          type="button"
          onClick={() => carouselApi?.scrollNext()}
          aria-label="Review berikutnya"
          className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1/2 hover:border-caramel hover:bg-caramel hover:text-white sm:flex"
        >
          <ArrowRight className="h-4 w-4" />
        </button>

        <Carousel opts={{ align: "start", loop: true }} setApi={setCarouselApi}>
          <CarouselContent className="-ml-4 lg:-ml-5">
            {reviews.map((review) => (
              <CarouselItem
                key={review.name}
                className="basis-full pl-4 sm:basis-1/2 sm:pl-4 lg:basis-1/3 lg:pl-5"
              >
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-white p-8 shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-caramel/40 hover:shadow-[0_30px_60px_-28px_rgba(34,81,56,0.35)] lg:p-9">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-3 right-4 select-none font-display text-[6rem] font-extralight leading-none text-caramel/[0.08] transition-colors duration-300 group-hover:text-caramel/15"
                  >
                    &ldquo;
                  </span>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <Star
                        key={s}
                        className="h-4 w-4 fill-amber text-amber"
                      />
                    ))}
                  </div>

                  <Quote className="mt-5 h-5 w-5 text-caramel/40" />

                  <blockquote className="mt-3 flex-1 font-sans text-sm leading-relaxed text-foreground/80">
                    &ldquo;{review.comment}&rdquo;
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
                        src={review.avatar}
                        alt={review.name}
                        className="object-cover"
                      />

                      <AvatarFallback className="bg-caramel font-display text-sm font-medium text-white">
                        {initialsOf(review.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-display text-base font-medium text-primary">
                        {review.name}
                      </p>

                      <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                        {review.timeAgo}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="mt-7 flex justify-center gap-2">
        {reviews.map((review, i) => (
          <button
            key={review.name}
            type="button"
            aria-label={`Ke review ${i + 1}`}
            onClick={() => carouselApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "w-8 bg-green-700"
                : "w-1.5 bg-charcoal-900/15 hover:bg-charcoal-900/30"
            }`}
          />
        ))}
      </div>
    </>
  );
}

/* ─── Not Found State ─── */
function StoreNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-5 font-sans text-charcoal-900">
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-sage-100 bg-white p-10 text-center shadow-md shadow-forest-900/5">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-green-700">
          <Utensils className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-xl font-medium tracking-tight text-forest-900">
            Toko tidak ditemukan
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal-500">
            Toko yang kamu cari tidak tersedia atau sudah tidak aktif. Coba
            jelajahi toko lain di beranda.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-700/20 transition-colors hover:bg-green-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}

/* ─── Food Card ─── */
function FoodCard({
  item,
  onSelect,
}: {
  item: FoodItem;
  onSelect: () => void;
}) {
  const stock = parseStock(item.stockLabel);
  const lowStock = stock !== null && stock <= 3;
  const savings = item.originalPrice - item.discountedPrice;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail ${item.name}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5 outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/15 focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
        <SmartImage
          src={item.image}
          alt={`Foto ${item.name}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <Badge variant="gold">{item.discountPercent}% OFF</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-sans text-base font-bold leading-snug text-charcoal-900">
            {item.name}
          </h3>
          <p className="mt-0.5 text-sm text-charcoal-500">{item.category}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-charcoal-500">
          <span className="flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 font-medium text-gold-600">
            <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
            {item.rating.toFixed(1)}
          </span>
          {!lowStock && <span>{item.stockLabel}</span>}
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0 text-sage-500" />
            {item.distanceKm} km
          </span>
        </div>

        <div className="mt-auto pt-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg font-bold text-green-700">
              {formatRupiah(item.discountedPrice)}
            </span>
            <span className="text-xs text-charcoal-500 line-through">
              {formatRupiah(item.originalPrice)}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-semibold text-green-600">
            Hemat {formatRupiah(savings)}
          </p>
        </div>

        <Link
          href={`/auth/register?produk=${item.id}`}
          onClick={(event) => event.stopPropagation()}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-green-700 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-700/20 transition-all duration-200 hover:bg-green-600 active:scale-[0.98]"
        >
          <ShoppingCart className="h-4 w-4" />
          Beli Sekarang
        </Link>
      </div>
    </article>
  );
}

/* ─── Main Content ─── */
function StoreDetailContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("id");
  const vendor: Vendor | undefined = vendors.find(
    (item) => item.id === storeId,
  );

  const foods = useMemo(
    () => (vendor ? getVendorFoods(vendor.name) : []),
    [vendor],
  );

  const categories = useMemo(
    () =>
      foods
        .map((item) => item.category)
        .filter((cat, index, all) => all.indexOf(cat) === index),
    [foods],
  );

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [openNow, setOpenNow] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const handleViewDetail = useCallback((id: string) => {
    setSelectedProductId(id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const selectedProduct = selectedProductId
    ? getProductById(selectedProductId)
    : undefined;

  useEffect(() => {
    setQuery("");
    setActiveCategory("Semua");
    setIsCategoryOpen(false);
    setOpenNow(true);
    setSelectedProductId(null);
  }, [storeId]);

  useEffect(() => {
    if (vendor) setOpenNow(isOpenNow(vendor.openHours));
  }, [vendor]);

  const displayCategories = ["Semua", ...categories];

  const visibleFoods = useMemo(() => {
    let items = foods;

    if (activeCategory !== "Semua") {
      items = items.filter((item) => item.category === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter((item) => item.name.toLowerCase().includes(q));
    }

    return items;
  }, [foods, query, activeCategory]);

  const isFiltering = query.trim().length > 0 || activeCategory !== "Semua";

  const hasResults = visibleFoods.length > 0;

  if (!vendor) {
    return <StoreNotFound />;
  }

  return (
    <main className="min-h-screen bg-cream-50 font-sans text-charcoal-900">
      {/* ─── Compact Hero ─── */}
      <section className="relative h-56 overflow-hidden sm:h-60 lg:h-72">
        <SmartImage
          src={vendor.image}
          alt={`Foto ${vendor.name}`}
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/5" />

        {/* Breadcrumb */}
        <div className="absolute inset-x-0 top-0 px-5 pt-5 sm:px-8 sm:pt-6">
          <div className="mx-auto max-w-[1200px]">
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-xs font-medium text-cream-50 backdrop-blur-sm transition-colors duration-200 hover:bg-black/45"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-8 sm:pb-6">
          <div className="mx-auto max-w-[1200px]">
            {vendor.isRescuePartner && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-green-700 px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                <BadgeCheck className="h-3 w-3" />
                Rescue Partner
              </span>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold leading-tight text-cream-50 sm:text-3xl lg:text-4xl">
                {vendor.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
                  openNow
                    ? "bg-green-600 text-white"
                    : "bg-white/85 text-white",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    openNow ? "bg-white" : "bg-red-500",
                  )}
                />
                {openNow ? "Buka Sekarang" : "Tutup"}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cream-50/90">
              <span className="flex items-center gap-1 font-semibold">
                <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
                {vendor.rating.toFixed(1)}
              </span>
              <span className="text-cream-50/40">·</span>
              <span>{vendor.distanceKm} km</span>
              <span className="text-cream-50/40">·</span>
              <span>{vendor.category}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-xs font-medium text-cream-50 backdrop-blur-sm">
                <Clock className="h-3.5 w-3.5" />
                {openNow ? "Buka" : "Tutup"} · {vendor.openHours}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-xs font-medium text-cream-50 backdrop-blur-sm">
                <Store className="h-3.5 w-3.5" />
                {foods.length} menu surplus
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white sm:text-sm">
              {vendor.description}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Menu Toolbar ─── */}
      <section className="border-b border-sage-100 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Cari menu di ${vendor.name}...`}
                aria-label="Cari menu di toko ini"
                className="w-full rounded-full border border-sage-100 bg-cream-50 py-2.5 pl-11 pr-10 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-500/70 focus:border-green-700 focus:bg-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-sage-100 text-charcoal-900 transition-colors hover:bg-sage-100/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Kategori accordion */}
            <div className="relative shrink-0 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setIsCategoryOpen((v) => !v)}
                aria-expanded={isCategoryOpen}
                aria-haspopup="listbox"
                className={cn(
                  "flex h-[38px] items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors duration-200",
                  activeCategory !== "Semua" || isCategoryOpen
                    ? "border-green-700 bg-white text-green-700"
                    : "border-sage-100 bg-white text-charcoal-900 hover:border-green-700 hover:text-green-700",
                )}
              >
                {activeCategory === "Semua" ? "Kategori" : activeCategory}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isCategoryOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-sage-100 bg-white p-2 shadow-lg shadow-forest-900/10"
                  >
                    {displayCategories.map((cat) => {
                      const isActive = activeCategory === cat;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setActiveCategory(cat);
                            setIsCategoryOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200",
                            isActive
                              ? "bg-green-700 font-semibold text-white"
                              : "text-charcoal-500 hover:bg-sage-100",
                          )}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Food Products ─── */}
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* Eco Banner */}
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-sage-100 bg-white p-4 sm:items-center sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-700/10 text-green-700">
            <Leaf className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-forest-900">
              Setiap pesanan di toko ini membantu mengurangi limbah makanan.
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-charcoal-500">
              Nikmati makanan enak dengan harga lebih hemat sekaligus ikut
              menjaga bumi.
            </p>
          </div>
        </div>

        <section id="menu-surplus" className="pt-7">
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleFoods.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <FoodCard
                    item={item}
                    onSelect={() => handleViewDetail(item.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!hasResults && (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-sage-100 bg-white p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-50 text-green-700 shadow-sm">
                <SearchX className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-bold text-charcoal-900">
                  Menu tidak ditemukan
                </p>
                <p className="mt-1 text-xs leading-relaxed text-sage-500">
                  Coba kata kunci lain atau lihat semua menu surplus di toko
                  ini.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("Semua");
                }}
                className="rounded-full border border-green-700 px-5 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-700 hover:text-white"
              >
                Lihat Semua Menu
              </button>
            </div>
          )}
        </section>

        {/* ─── Review Pelanggan tentang Pelayanan Toko ─── */}
        <section id="tentang-toko" className="mt-16 pb-4">
          <StoreServiceReviews vendor={vendor} />
        </section>
      </div>

      <SiteFooter />

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─── Page ─── */
export default function DetailTokoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <StoreDetailContent />
    </Suspense>
  );
}
