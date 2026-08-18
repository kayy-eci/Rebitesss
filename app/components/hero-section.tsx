'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Leaf,
  Lock,
  Menu,
  Soup,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HERO_IMAGE =
  'https://images.pexels.com/photos/16134564/pexels-photo-16134564.jpeg?auto=compress&cs=tinysrgb&w=1000';

const NAV_LINKS = [
  { href: '/#top', label: 'Beranda' },
  { href: '/#menu', label: 'Menu' },
  { href: '/#cta', label: 'Reservasi' },
  { href: '/#cara-kerja', label: 'Layanan' },
  { href: '/#masalah', label: 'Tentang' },
  { href: '/#dampak', label: 'Blog' },
  { href: '/#langganan', label: 'FAQ' },
];

const MENU_ITEMS = [
  {
    name: 'Ikan & Sayur, Surplus Hari Ini',
    subtitle: 'Saus Jamur',
    price: 'Rp45.000',
    image:
      'https://images.pexels.com/photos/8964280/pexels-photo-8964280.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Ikan panggang dengan saus jamur dari kelebihan pasokan hari ini',
  },
  {
    name: 'Pasta Carbonara, Sisa Produksi Segar',
    subtitle: 'Krim & Guanciale',
    price: 'Rp58.000',
    image:
      'https://images.pexels.com/photos/546945/pexels-photo-546945.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Pasta carbonara krim dari sisa produksi dapur yang masih segar',
  },
  {
    name: 'Mangkuk Pasta Premium',
    subtitle: 'Saus Truffle',
    price: 'Rp52.000',
    image:
      'https://images.pexels.com/photos/8697516/pexels-photo-8697516.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Mangkuk pasta premium dengan saus truffle',
  },
  {
    name: 'Salad Segar Kebun',
    subtitle: 'Vinaigrette Lemon',
    price: 'Rp32.000',
    image:
      'https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Salad sayur segar dengan vinaigrette lemon',
  },
  {
    name: 'Tuna Bowl Berbumbu',
    subtitle: 'Selada & Tomat',
    price: 'Rp38.000',
    image:
      'https://images.pexels.com/photos/19572488/pexels-photo-19572488.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Bowl tuna segar dengan selada dan tomat',
  },
];

const CARD_GAP = 24;

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

export function HeroSection() {
  const [open, setOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Beranda');
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [overDark, setOverDark] = useState(false);

  const t = (id: string, en: string) => (lang === 'en' ? en : id);

  useEffect(() => {
    const darkSections = ['masalah', 'cta']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (darkSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setOverDark(entries.some((e) => e.isIntersecting));
      },
      { rootMargin: '0px 0px -70% 0px' }
    );

    darkSections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-cream">
      {/* ── Navbar (pill, transparan, menyesuaikan bg) ──── */}
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-3 sm:px-8 sm:pt-4">
        <div className="mx-auto w-full max-w-[1200px]">
          <nav
            className={cn(
              'flex h-16 items-center justify-between rounded-full border px-5 shadow-[0_20px_44px_-26px_rgba(34,81,56,0.45)] backdrop-blur-xl transition-colors duration-500 sm:px-6 lg:px-8',
              overDark
                ? 'border-white/15 bg-forest-dark/75 text-white'
                : 'border-hairline/70 bg-cream/80 text-forest-dark'
            )}
          >
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500',
                  overDark ? 'bg-white text-forest-dark' : 'bg-forest text-white'
                )}
              >
                <Leaf className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  'font-display text-2xl font-bold tracking-tight transition-colors duration-500',
                  overDark ? 'text-white' : 'text-forest-dark'
                )}
              >
                ReBites
              </span>
            </Link>

            <ul className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((l) => (
                <li key={l.label} className="relative">
                  <Link
                    href={l.href}
                    onClick={() => setActiveNav(l.label)}
                    aria-current={activeNav === l.label ? 'page' : undefined}
                    className={cn(
                      'relative py-1 font-sans text-sm transition-colors duration-300',
                      activeNav === l.label
                        ? overDark
                          ? 'font-semibold text-white'
                          : 'font-semibold text-forest-dark'
                        : overDark
                          ? 'text-white/80 hover:text-white'
                          : 'text-forest-dark/80 hover:text-forest'
                    )}
                  >
                    {l.label}
                    {activeNav === l.label && (
                      <span
                        className={cn(
                          'absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full transition-colors duration-500',
                          overDark ? 'bg-white' : 'bg-forest'
                        )}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className={cn(
                  'hidden items-center gap-1.5 rounded-full px-5 py-2.5 font-sans text-sm font-semibold shadow-[0_14px_30px_-18px_rgba(34,81,56,0.65)] transition-colors duration-300 sm:flex',
                  overDark
                    ? 'bg-white text-forest-dark hover:bg-white/90'
                    : 'bg-forest text-white hover:bg-forest-dark',
                  FOCUS_RING
                )}
              >
                <Lock className="h-3.5 w-3.5" />
                {t('Masuk', 'Log In')}
              </Link>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Buka menu"
                aria-expanded={open}
                className={cn(
                  'flex h-10 w-10 items-center justify-center lg:hidden',
                  overDark ? 'text-white' : 'text-forest',
                  FOCUS_RING
                )}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2 overflow-hidden rounded-3xl border border-hairline/70 bg-white p-3 shadow-[0_28px_56px_-28px_rgba(34,81,56,0.5)] lg:hidden"
              >
                <ul className="flex flex-col">
                  {NAV_LINKS.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        onClick={() => {
                          setActiveNav(l.label);
                          setOpen(false);
                        }}
                        className="flex items-center justify-between rounded-2xl px-4 py-3 font-sans text-sm text-forest-dark transition-colors duration-300 hover:bg-cream"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex border-t border-hairline/70 pt-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-forest py-3 font-sans text-sm font-semibold text-white transition-colors duration-300 hover:bg-forest-dark"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    {t('Masuk', 'Log In')}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────── */}
      <section
        id="top"
        className="relative overflow-hidden bg-cream px-5 pb-24 pt-24 sm:px-8 lg:px-12 lg:pb-32 lg:pt-28"
      >
        {/* Garis lengkung dekoratif */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="rb-curve" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#225138" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#225138" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F7F5EF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M -40,140 C 260,320 620,180 1240,640"
            fill="none"
            stroke="url(#rb-curve)"
            strokeWidth="2"
          />
          <path
            d="M -40,230 C 320,390 660,270 1240,700"
            fill="none"
            stroke="url(#rb-curve)"
            strokeWidth="1.2"
          />
        </svg>

        {/* Line-art piring & perkakas makan, pojok kanan atas */}
        <LineArt className="pointer-events-none absolute -right-14 -top-8 hidden w-80 opacity-70 md:block" />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2 lg:gap-10">
          {/* Kolom kiri: teks */}
          <div className="max-w-[560px]">
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-forest/40 px-4 py-1.5',
                FOCUS_RING
              )}
            >
              <Leaf className="h-3.5 w-3.5 text-forest" />
              <span className="font-sans text-xs font-semibold text-forest">
                {t('Rasa Baik, Tanpa Ribet.', 'Great Taste, No Fuss.')}
              </span>
            </span>

            <h1 className="mt-7 font-display text-[clamp(2.4rem,4.8vw,4.3rem)] font-bold leading-[1.04] tracking-[-0.02em]">
              <span className="text-forest-dark">
                Tempat untuk <span className="text-forest">Rasa Terbaik</span>
                <span className="ml-3 inline-flex shrink-0 translate-y-1 align-middle sm:ml-5">
                  <CircularStamp />
                </span>
              </span>
              <span className="block text-forest-dark">
                &amp; Kebersamaan Lebih Baik
              </span>
            </h1>

            <p className="mt-6 max-w-[460px] font-sans text-[0.95rem] leading-[1.85] text-stone">
              Bahan segar, diracik penuh perhatian. Menu yang terinspirasi
              dari musim dan kelebihan pasokan terbaik. Baik untuk camilan
              cepat atau makan malam panjang, meja kami selalu terbuka untukmu.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/#menu"
                className={cn(
                  'group inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-7 py-3.5 font-sans text-sm font-semibold text-forest-dark shadow-[0_14px_30px_-20px_rgba(34,81,56,0.55)] transition-all duration-300 hover:border-[#8C5A3C]/40 hover:text-[#8C5A3C]',
                  FOCUS_RING
                )}
              >
                <Soup className="h-4 w-4 text-forest transition-transform duration-300 group-hover:rotate-6" />
                {t('Pesan Sekarang', 'Order Now')}
              </Link>

              <Link
                href="/#cta"
                className={cn(
                  'group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-7 py-3.5 font-sans text-sm font-semibold text-white shadow-[0_16px_32px_-16px_rgba(34,81,56,0.65)] transition-all duration-300 hover:shadow-[0_18px_38px_-16px_rgba(34,81,56,0.85)]',
                  FOCUS_RING
                )}
              >
                <Calendar className="h-4 w-4" />
                {t('Reservasi Meja', 'Book a Table')}
              </Link>
            </div>
          </div>

          {/* Kolom kanan: foto hidangan cutout organik */}
          <div className="relative mx-auto w-full max-w-[500px]">
            {/* blob sage semi-transparan */}
            <svg
              aria-hidden
              viewBox="0 0 520 560"
              className="absolute left-1/2 top-1/2 w-[112%] -translate-x-1/2 -translate-y-1/2"
            >
              <path
                d="M260 30 C380 26 470 90 496 190 C522 290 500 380 430 448 C360 516 260 540 170 512 C80 484 26 400 24 300 C22 200 130 34 260 30 Z"
                fill="#AEB89B"
                fillOpacity="0.45"
              />
            </svg>

            {/* foto utama, cutout mengikuti bentuk organik */}
            <svg
              viewBox="0 0 500 500"
              role="img"
              aria-label="Hidangan segar hasil selamatkan ReBites, tampak atas di atas piring gelap"
              className="relative z-10 w-full drop-shadow-[0_34px_54px_-28px_rgba(34,81,56,0.55)]"
            >
              <defs>
                <clipPath id="dishCutout">
                  <path d="M250 22 C340 18 440 78 468 172 C490 250 480 340 430 408 C380 476 300 500 220 496 C140 492 70 440 44 356 C18 272 30 176 88 108 C146 40 160 26 250 22 Z" />
                </clipPath>
              </defs>
              <image
                href={HERO_IMAGE}
                x="0"
                y="0"
                width="500"
                height="500"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#dishCutout)"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ── CAROUSEL MENU ───────────────────────────────── */}
      <MenuCarousel />

      {/* ── Tombol floating: kembali ke atas ────────────── */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Kembali ke atas"
        className={cn(
          'fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white text-forest shadow-[0_16px_32px_-16px_rgba(34,81,56,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8C5A3C] hover:text-white',
          FOCUS_RING
        )}
      >
        <Leaf className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ── Lencana stempel melingkar ───────────────────────── */
function CircularStamp() {
  return (
    <span
      className="relative inline-flex h-14 w-14 items-center justify-center sm:h-20 sm:w-20"
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <path
            id="stampCircle"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#DEDACF"
          strokeWidth="1.4"
          strokeDasharray="5 4"
        />
        <text
          className="font-sans font-semibold uppercase"
          fontSize="8.2"
          letterSpacing="2.4"
          fill="#225138"
          style={{ fontFamily: 'var(--font-sans), Inter, sans-serif' }}
        >
          <textPath href="#stampCircle" startOffset="0%">
            RESCUED • FRESH • DAILY •
          </textPath>
        </text>
      </svg>
      <span className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white sm:h-10 sm:w-10">
        <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </span>
    </span>
  );
}

/* ── Ilustrasi line-art piring & perkakas ────────────── */
function LineArt({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 320" fill="none" className={className}>
      <g
        stroke="#6B6A63"
        strokeOpacity="0.3"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="120" cy="130" r="84" />
        <circle cx="120" cy="130" r="60" />
        <circle cx="120" cy="130" r="38" />
        <path d="M228 34 L206 128" />
        <path d="M218 42 L202 124" />
        <path d="M240 40 L210 130" />
        <path d="M206 118 C200 158 210 186 222 232 C229 258 234 270 240 290" />
        <path d="M272 36 L278 148" />
        <path d="M270 148 C262 192 268 236 278 272 C283 292 280 300 274 308" />
      </g>
    </svg>
  );
}

/* ── Carousel kartu menu (fungsional) ────────────────── */
function MenuCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const suppressRef = useRef(false);

  const setActive = (i: number) => {
    activeIndexRef.current = i;
    setActiveIndex(i);
  };

  const getStep = () => {
    const scroller = scrollerRef.current;
    const card = scroller?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + CARD_GAP : 284;
  };

  const scrollToCard = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const max = Math.max(scroller.scrollWidth - scroller.clientWidth, 0);
    scroller.scrollTo({
      left: Math.min(index * getStep(), max),
      behavior: 'smooth',
    });
  };

  const navigate = (dir: number) => {
    const next =
      (activeIndexRef.current + dir + MENU_ITEMS.length) % MENU_ITEMS.length;
    setActive(next);
    suppressRef.current = true;
    scrollToCard(next);
    window.setTimeout(() => {
      suppressRef.current = false;
    }, 900);
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressRef.current) return;
        let bestIndex = -1;
        let bestRatio = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = idx;
          }
        }
        if (bestIndex >= 0 && bestIndex !== activeIndexRef.current) {
          setActive(bestIndex);
        }
      },
      { root: scroller, threshold: [0.2, 0.4, 0.6, 0.8] }
    );

    scroller
      .querySelectorAll<HTMLElement>('[data-index]')
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="menu"
      className="relative bg-cream px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-forest/40 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-forest" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                Menu Hari Ini
              </span>
            </span>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(1.8rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-forest-dark">
              Diselamatkan dari kelebihan pasokan, disajikan penuh rasa.
            </h2>
          </div>
        </div>

        <div
          ref={scrollerRef}
          tabIndex={0}
          aria-label="Daftar menu hari ini, dapat digeser untuk menjelajah"
          className="mt-12 flex snap-x snap-proximity gap-6 overflow-x-auto scroll-smooth pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {MENU_ITEMS.map((item, i) => (
            <MenuCard
              key={item.name}
              {...item}
              index={i}
              active={i === activeIndex}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-4 rounded-full bg-white px-6 py-3 shadow-[0_18px_40px_-26px_rgba(34,81,56,0.5)]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Menu sebelumnya"
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full bg-white text-forest-dark shadow-[0_10px_22px_-12px_rgba(34,81,56,0.6)] transition-all duration-300 hover:bg-cream hover:text-forest',
                FOCUS_RING
              )}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[3ch] text-center font-sans text-sm font-semibold text-stone">
              {activeIndex + 1}
              <span className="mx-0.5 text-stone/60">/</span>
              {MENU_ITEMS.length}
            </span>
            <button
              type="button"
              onClick={() => navigate(1)}
              aria-label="Menu berikutnya"
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full bg-forest-dark text-white shadow-[0_10px_22px_-12px_rgba(34,81,56,0.8)] transition-all duration-300 hover:bg-forest',
                FOCUS_RING
              )}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuCard({
  name,
  subtitle,
  price,
  image,
  alt,
  index,
  active,
}: {
  name: string;
  subtitle: string;
  price: string;
  image: string;
  alt: string;
  index: number;
  active: boolean;
}) {
  return (
    <article
      data-index={index}
      className="relative w-[260px] shrink-0 snap-start pt-12"
    >
      <img
        src={image}
        alt={alt}
        width={300}
        height={300}
        loading="lazy"
        className="absolute left-1/2 top-0 z-10 h-24 w-24 -translate-x-1/2 rounded-full border-8 object-cover shadow-[0_16px_30px_-18px_rgba(34,81,56,0.6)] transition-colors duration-300"
        style={{ borderColor: active ? '#225138' : '#FFFFFF' }}
      />
      <div
        className={cn(
          'rounded-2xl p-6 pt-16 transition-colors duration-300',
          active
            ? 'bg-forest text-white shadow-[0_28px_56px_-28px_rgba(34,81,56,0.7)]'
            : 'bg-white'
        )}
      >
        <h3
          className={cn(
            'font-display text-lg font-bold leading-snug',
            active ? 'text-white' : 'text-forest-dark'
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            'mt-1.5 font-sans text-sm',
            active ? 'text-white/75' : 'text-stone'
          )}
        >
          {subtitle}
        </p>
        <p
          className={cn(
            'mt-4 font-display text-xl font-bold',
            active ? 'text-white' : 'text-forest'
          )}
        >
          {price}
        </p>
      </div>
    </article>
  );
}
