"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah, urgentItems } from "@/lib/data";
import { useCountdown, formatCountdown } from "@/lib/useCountdown";
import { SmartImage } from "@/app/components/SmartImage";
import { SoftBlob } from "@/app/components/Ornaments";
import { Marquee } from "@/app/components/marquee";
import type { UrgentItem, UrgentSlot } from "@/lib/types";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E05A33] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const WIB_OFFSET_MS = 7 * 3600 * 1000;

const SLOTS: {
  key: UrgentSlot;
  start: number;
  end: number;
  range: string;
  name: string;
}[] = [
  { key: "09-12", start: 9, end: 12, range: "09.00–12.00", name: "Pagi" },
  { key: "12-15", start: 12, end: 15, range: "12.00–15.00", name: "Siang" },
  { key: "15-18", start: 15, end: 18, range: "15.00–18.00", name: "Sore" },
  { key: "18-21", start: 18, end: 21, range: "18.00–21.00", name: "Malam" },
];

/* ── Real-time WIB helpers ─────────────────────────────── */

function getWibParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")) % 24,
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

function wibEpochOfToday(h: number, min = 0, sec = 0) {
  const p = getWibParts();
  return Date.UTC(p.year, p.month - 1, p.day, h, min, sec) - WIB_OFFSET_MS;
}

function nextStartEpoch() {
  const p = getWibParts();
  const secondsToday = p.hour * 3600 + p.minute * 60 + p.second;
  const dayOffset = secondsToday < 9 * 3600 ? 0 : 1;
  return wibEpochOfToday(9) + dayOffset * 24 * 3600 * 1000;
}

function getSlotFromHour(h: number): UrgentSlot | null {
  if (h >= 9 && h < 12) return "09-12";
  if (h >= 12 && h < 15) return "12-15";
  if (h >= 15 && h < 18) return "15-18";
  if (h >= 18 && h < 21) return "18-21";
  return null;
}

function slotEndHour(key: UrgentSlot) {
  return SLOTS.find((s) => s.key === key)!.end;
}

function useSlotRotation() {
  const [tick, setTick] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<UrgentSlot | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 20_000);
    return () => clearInterval(id);
  }, []);

  void tick;
  const realSlot = getSlotFromHour(getWibParts().hour);
  const activeSlot = selectedSlot ?? realSlot;

  return { realSlot, selectedSlot, setSelectedSlot, activeSlot };
}

/* ── Small pieces ──────────────────────────────────────── */

function parseStockCount(label: string) {
  const match = label.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function SectionCountdown({
  deadlineIso,
  label,
}: {
  deadlineIso: string;
  label: string;
}) {
  const remaining = useCountdown(deadlineIso);
  const text = remaining === null ? "00:00:00" : formatCountdown(remaining);
  const [h, m, s] = text.split(":");

  return (
    <div className="rounded-2xl bg-white px-5 py-3.5 shadow-[0_18px_40px_-18px_rgba(94,31,18,0.45)]">
      <div className="flex items-center gap-2.5">
        <Flame className="h-5 w-5 shrink-0 text-[#E05A33]" />
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#9E2B1D]">
          {label}
        </p>
      </div>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="min-w-[2ch] text-center font-sans text-2xl font-bold tabular-nums leading-none text-[#5E1F12] sm:text-3xl">
          {h}
        </span>
        <span aria-hidden className="w-[1ch] text-center font-sans text-2xl font-bold leading-none text-[#E05A33] sm:text-3xl">
          :
        </span>
        <span className="min-w-[2ch] text-center font-sans text-2xl font-bold tabular-nums leading-none text-[#5E1F12] sm:text-3xl">
          {m}
        </span>
        <span aria-hidden className="w-[1ch] text-center font-sans text-2xl font-bold leading-none text-[#E05A33] sm:text-3xl">
          :
        </span>
        <span className="min-w-[2ch] text-center font-sans text-2xl font-bold tabular-nums leading-none text-[#5E1F12] sm:text-3xl">
          {s}
        </span>
      </div>

      <div className="mt-1 flex gap-1 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9E2B1D]/60">
        <span className="min-w-[2ch] text-center">Jam</span>
        <span aria-hidden className="w-[1ch]" />
        <span className="min-w-[2ch] text-center">Menit</span>
        <span aria-hidden className="w-[1ch]" />
        <span className="min-w-[2ch] text-center">Detik</span>
      </div>
    </div>
  );
}

function UrgentCard({
  item,
  deadlineIso,
}: {
  item: UrgentItem;
  deadlineIso: string;
}) {
  const remaining = useCountdown(deadlineIso);
  const isExpired = remaining === 0;

  const stockCount = parseStockCount(item.stockLabel);
  const stockPct =
    stockCount === null ? null : Math.max(10, Math.min(95, stockCount * 10));

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-[#7E2F1D]/15 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#B3402A]/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EAD6C4]">
        <SmartImage
          src={item.image}
          alt={`Foto ${item.name} dari ${item.vendorName}`}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "transition-transform duration-500 group-hover:scale-105",
            isExpired && "grayscale",
          )}
        />

        {/* Shine sweep */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-10 w-1/3 -skew-x-12 bg-white/30 blur-md"
          initial={{ left: "-40%" }}
          animate={{ left: "130%" }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatDelay: 2,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        {/* SURPLUS chip */}
        <div className="absolute left-3 top-3 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9E2B1D] shadow-md">
            <Flame className="h-3 w-3 text-[#E05A33]" />
            Surplus
          </span>
        </div>

        {/* Discount ribbon */}
        <motion.div
          className="absolute right-3 top-3 z-20"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative rounded-lg bg-gradient-to-br from-[#C94A32] to-[#9E2B1D] px-3 py-2 text-center text-white shadow-[0_10px_22px_-10px_rgba(158,43,29,0.85)]">
            <span className="block font-sans text-base font-black leading-none tabular-nums">
              {item.discountPercent}%
            </span>
            <span className="block font-sans text-[9px] font-bold uppercase leading-tight tracking-[0.18em]">
              Off
            </span>
            <span
              aria-hidden
              className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#9E2B1D]"
            />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-sans text-base font-bold leading-snug text-charcoal-900">
            {item.name}
          </h3>
          <p className="mt-0.5 text-sm text-charcoal-500">{item.vendorName}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-charcoal-500">
          <span className="flex items-center gap-1 font-medium">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {item.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-sage-500" />
            {item.distanceKm} km
          </span>
        </div>

        {stockPct === null ? (
          <span className="w-fit rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-charcoal-500">
            {item.stockLabel}
          </span>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#9E2B1D]">
                Sisa {stockCount}
              </span>
              <span className="text-charcoal-500">
                {isExpired ? "Habis" : "Buru!"}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-red-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#B3402A] to-[#E05A33]"
                initial={{ width: 0 }}
                whileInView={{ width: `${stockPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm text-charcoal-500 line-through">
            {formatRupiah(item.originalPrice)}
          </span>
          <span className="text-xl font-bold text-[#B3402A]">
            {formatRupiah(item.discountedPrice)}
          </span>
        </div>

        <motion.button
          type="button"
          disabled={isExpired}
          aria-label={
            isExpired ? `${item.name} sudah habis` : `Lihat detail ${item.name}`
          }
          animate={
            !isExpired
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(179,64,42,0.45)",
                    "0 0 0 12px rgba(179,64,42,0)",
                    "0 0 0 0 rgba(179,64,42,0)",
                  ],
                }
              : undefined
          }
          transition={
            !isExpired
              ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          className={cn(
            "mt-1 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold shadow-lg transition-colors duration-200 active:scale-[0.98]",
            isExpired
              ? "cursor-not-allowed bg-sage-100 text-charcoal-500"
              : "bg-gradient-to-r from-[#B3402A] to-[#E05A33] text-white shadow-[#B3402A]/30 hover:from-[#9E2B1D] hover:to-[#D14E26]",
            FOCUS_RING,
          )}
        >
          <Flame
            className={cn(
              "h-4 w-4",
              isExpired ? "text-charcoal-500" : "text-amber-200",
            )}
          />
          {isExpired ? "Habis" : "Beli"}
        </motion.button>
      </div>
    </article>
  );
}

export function UrgentDealsSection() {
  const { realSlot, setSelectedSlot, activeSlot } = useSlotRotation();

  const slotEndIso = activeSlot
    ? new Date(wibEpochOfToday(slotEndHour(activeSlot))).toISOString()
    : null;
  const nextStartIso = new Date(nextStartEpoch()).toISOString();

  const visibleItems = activeSlot
    ? urgentItems.filter((i) => i.slot === activeSlot)
    : [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-[#DC2626] via-[#F26B5E] to-[#FFF6F4]">
      {/* Marquee */}
      <div className="relative border-b border-white/15 bg-[#5E1F12]/40 py-3">
        <Marquee pauseOnHover>
          {[
            "SURPLUS",
            "DISKON HINGGA 50%",
            "SELAMATKAN SEBELUM HABIS",
            "MAKANAN BERSIH & LAYAK KONSUMSI",
          ].map((t, i) => (
            <span
              key={i}
              className="mx-6 flex items-center gap-3 font-display text-lg font-medium text-white tracking-tight lg:text-xl"
            >
              {t}
              <span className="text-amber-300/70">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Decorative layer */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* White & rose glows */}
        <SoftBlob className="-left-24 top-1/4 h-80 w-80 bg-white/25" />
        <SoftBlob className="-right-20 bottom-0 h-96 w-96 bg-[#FFF6F4]/40" />
        <SoftBlob className="-bottom-24 left-1/3 h-80 w-80 bg-red-500/20" />

        {/* Floating sparkles */}
        {[
          { top: "10%", left: "8%" },
          { top: "22%", right: "12%" },
          { top: "46%", left: "3%" },
          { top: "70%", right: "6%" },
          { bottom: "8%", right: "20%" },
        ].map((pos, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute text-white/60"
            style={pos}
            animate={{
              y: [0, -12, 0],
              rotate: [0, 45, 0],
              opacity: [0.35, 1, 0.35],
            }}
            transition={{
              duration: 4.5 + i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            ✦
          </motion.span>
        ))}

        {/* Floating confetti dots */}
        {[
          { top: "14%", left: "5%" },
          { top: "32%", right: "8%" },
          { bottom: "16%", left: "11%" },
          { top: "58%", right: "4%" },
        ].map((pos, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute h-2 w-2 rounded-full bg-white/70"
            style={pos}
            animate={{
              y: [0, -18, 0],
              rotate: [0, 120, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          />
        ))}

        {[
          { top: "20%", left: "30%" },
          { top: "55%", right: "16%" },
          { bottom: "12%", left: "24%" },
        ].map((pos, i) => (
          <motion.span
            key={`red-dot-${i}`}
            aria-hidden
            className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-red-400/60"
            style={pos}
            animate={{
              y: [0, -14, 0],
              rotate: [0, -100, 0],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 4.8 + i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-amber-200">
                Flash Sale
              </span>
            </div>

            <h2 className="mt-3 flex items-center gap-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Segera <span>Beli</span>
              <motion.span
                className="inline-block text-amber-300"
                animate={{ rotate: [0, -12, 12, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Flame className="h-9 w-9 sm:h-11 sm:w-11" />
              </motion.span>
            </h2>

            <p className="mt-3 max-w-md font-inter text-sm text-white/80">
              Makanan surplus pilihan dengan harga lebih hemat. Jangan sampai
              kelewatan sebelum stoknya habis!
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {slotEndIso ? (
              <SectionCountdown
                deadlineIso={slotEndIso}
                label="Berakhir dalam"
              />
            ) : (
              <SectionCountdown
                deadlineIso={nextStartIso}
                label="Flash sale dimulai dalam"
              />
            )}
          </div>
        </div>

        {/* Slot pills */}
        <div className="relative mt-9 flex flex-wrap items-center gap-2">
          {SLOTS.map((slot) => {
            const isReal = realSlot === slot.key;
            const isActive = activeSlot === slot.key;
            return (
              <button
                key={slot.key}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  setSelectedSlot((prev) =>
                    prev === slot.key ? null : slot.key,
                  )
                }
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-full border px-4 py-2.5 font-sans transition-all duration-300",
                  isActive
                    ? "border-transparent bg-white text-[#9E2B1D] shadow-lg shadow-[#7E2F1D]/35"
                    : "border-white/25 bg-white/10 text-white/85 backdrop-blur-sm hover:border-white/50 hover:bg-white/20 hover:text-white",
                  FOCUS_RING,
                )}
              >
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold tabular-nums">
                    {slot.range}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-[0.18em]",
                      isActive ? "text-[#B3402A]/70" : "text-white/55",
                    )}
                  >
                    {slot.name}
                  </span>
                </span>
                {isReal && (
                  <span
                    className="relative flex h-2 w-2 shrink-0"
                    title="Slot aktif sekarang"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative mt-10">
          {visibleItems.length > 0 ? (
            <motion.div
              key={activeSlot}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {visibleItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <UrgentCard item={item} deadlineIso={slotEndIso!} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-white/20 bg-black/20 p-10 text-center backdrop-blur-sm sm:p-14"
            >
              <motion.span
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Flame className="h-7 w-7 text-amber-300" />
              </motion.span>
              <p className="mt-5 font-sans text-xs font-bold uppercase tracking-[0.3em] text-amber-200">
                Flash Sale WIB
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Flash sale dimulai pukul 09.00 WIB
              </h3>
              <p className="mx-auto mt-3 max-w-md font-inter text-sm text-white/75">
                Produk surplus berganti setiap 3 jam — pagi, siang, sore, dan
                malam. Siap-siap menyelamatkannya sebelum habis!
              </p>
              <div className="mt-7 flex justify-center">
                <SectionCountdown
                  deadlineIso={nextStartIso}
                  label="Dimulai dalam"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
