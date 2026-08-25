"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  MapPin,
  Quote,
  Search,
  SearchX,
  ShoppingCart,
  Star,
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
import { StoreHeroCard } from "./store-hero-card";
import { StoreAboutImpact } from "./store-about-impact";
import { SERVICE_REVIEWS, type ServiceReview } from "./service-reviews";
import {
  SELLER_VENDOR_SLUG,
  getSellerProducts,
  isProductAvailable,
  PRODUCTS_UPDATED_EVENT,
  getFeaturedProductIds,
} from "@/lib/product-storage";
import type { SellerProduct } from "@/lib/product-storage";
import {
  getDisplayPricing,
  getFlashDiscountPercent,
} from "@/lib/flash-sale";
import {
  getSellerStoreSettings,
  STORE_SETTINGS_UPDATED_EVENT,
} from "@/lib/store-settings-storage";


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


function sellerProductToFoodItem(
  sp: SellerProduct,
  vendor: Vendor
): FoodItem {

  const pricing = getDisplayPricing(sp);
  return {
    id: sp.id,
    name: sp.name,
    vendorName: vendor.name,
    image: sp.image,
    category: sp.category as FoodItem["category"],
    rating: 4.7,
    distanceKm: vendor.distanceKm,
    availableFrom: sp.startTime,
    availableTo: sp.endTime,
    stockLabel: sp.stock > 0 ? `${sp.stock} porsi tersisa` : "Habis",
    originalPrice: sp.originalPrice,
    discountedPrice: pricing.price,
    discountPercent: pricing.isFlash
      ? getFlashDiscountPercent(sp)
      : sp.discountPercent,
  };
}


function getSellerVendorFoods(vendor: Vendor): FoodItem[] {
  const sellerProducts = getSellerProducts();
  return sellerProducts.map((sp) => sellerProductToFoodItem(sp, vendor));
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


function FoodCard({
  item,
  onSelect,
  forceUnavailable,
}: {
  item: FoodItem;
  onSelect: () => void;

  forceUnavailable?: boolean;
}) {
  const stock = parseStock(item.stockLabel);
  const lowStock = stock !== null && stock <= 3;
  const savings = item.originalPrice - item.discountedPrice;
  const isUnavailable = forceUnavailable === true || item.stockLabel === "Habis";

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
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2",
        isUnavailable
          ? "opacity-60 shadow-none hover:translate-y-0 hover:shadow-md"
          : "shadow-forest-900/5 hover:shadow-xl hover:shadow-forest-900/15"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
        <SmartImage
          src={item.image}
          alt={`Foto ${item.name}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "transition-transform duration-500 group-hover:scale-105",
            isUnavailable && "grayscale-[40%]"
          )}
        />
        <div className="absolute right-3 top-3">
          <Badge variant="gold">{item.discountPercent}% OFF</Badge>
        </div>
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900/40">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-charcoal-900 shadow-lg">
              {stock === 0 ? "Stok Habis" : "Tidak Tersedia"}
            </span>
          </div>
        )}
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

        {isUnavailable ? (
          <div className="mt-1 flex w-full items-center justify-center gap-2 rounded-full border border-sage-200 bg-sage-50 py-2.5 text-sm font-semibold text-charcoal-500">
            {stock === 0 ? "Stok Habis" : "Di Luar Jam Jual"}
          </div>
        ) : (
          <Link
            href={`/auth/register?produk=${item.id}`}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto mt-1 flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-green-700 px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-700/20 transition-all duration-200 hover:bg-green-600 active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4" />
            Beli Sekarang
          </Link>
        )}
      </div>
    </article>
  );
}


function StoreDetailContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("id");
  const vendor: Vendor | undefined = vendors.find(
    (item) => item.id === storeId,
  );


  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>([]);
  const isSellerVendor = vendor?.id === SELLER_VENDOR_SLUG;

  useEffect(() => {
    if (!isSellerVendor) return;
    const refresh = () => setSellerProducts(getSellerProducts());
    refresh();
    window.addEventListener(PRODUCTS_UPDATED_EVENT, refresh);
    window.addEventListener(STORE_SETTINGS_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, refresh);
      window.removeEventListener(STORE_SETTINGS_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [isSellerVendor]);

  const foods = useMemo(
    () => {
      if (!vendor) return [];
      if (isSellerVendor && sellerProducts.length > 0) {
        return sellerProducts.map((sp) => sellerProductToFoodItem(sp, vendor));
      }
      return getVendorFoods(vendor.name);
    },
    [vendor, isSellerVendor, sellerProducts]
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


  const featuredIds = useMemo(
    () =>
      vendor?.id === SELLER_VENDOR_SLUG
        ? new Set(getFeaturedProductIds())
        : new Set<string>(),
    [vendor]
  );


  const sellerAvailability = useMemo(() => {
    if (!isSellerVendor) return new Map<string, boolean>();
    const map = new Map<string, boolean>();
    for (const sp of sellerProducts) {
      map.set(sp.id, isProductAvailable(sp));
    }
    return map;
  }, [isSellerVendor, sellerProducts]);

  const visibleFoods = useMemo(() => {
    let items = foods;

    if (activeCategory !== "Semua") {
      items = items.filter((item) => item.category === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter((item) => item.name.toLowerCase().includes(q));
    }

    return [...items].sort(
      (a, b) =>
        Number(featuredIds.has(b.id)) - Number(featuredIds.has(a.id))
    );
  }, [foods, query, activeCategory, featuredIds]);

  const isFiltering = query.trim().length > 0 || activeCategory !== "Semua";

  const hasResults = visibleFoods.length > 0;

  if (!vendor) {
    return <StoreNotFound />;
  }

  return (
    <main className="min-h-screen bg-cream-50 font-sans text-charcoal-900">
      { }
      <StoreHeroCard vendor={vendor} openNow={openNow} />

      { }
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <section id="menu-surplus" className="pt-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Menu Surplus Hari Ini
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-medium tracking-tight text-forest-900 sm:text-3xl">
            Menu Surplus dari {vendor.name}
          </h2>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
            { }
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

            { }
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

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleFoods.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="relative"
                >
                  {featuredIds.has(item.id) && (
                    <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-900 shadow-sm">
                      <Star className="h-3 w-3 fill-current" />
                      Unggulan
                    </span>
                  )}
                  <FoodCard
                    item={item}
                    onSelect={() => handleViewDetail(item.id)}
                    forceUnavailable={isSellerVendor && sellerAvailability.has(item.id) ? !sellerAvailability.get(item.id) : undefined}
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
      </div>

      { }
      <StoreAboutImpact vendor={vendor} />

      { }
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <section id="tentang-toko" className="mt-14 pb-4">
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


export default function DetailTokoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <StoreDetailContent />
    </Suspense>
  );
}
