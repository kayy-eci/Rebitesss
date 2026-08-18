'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Leaf,
  MapPin,
  Menu,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LOCATIONS = ['Depok', 'Jakarta Selatan', 'Bekasi', 'Bogor', 'Tangerang'];

const NAV_LINKS = [
  { id: 'home', label: 'Beranda' },
  { id: 'flashSale', label: 'Flash Sale' },
  { id: 'makanan', label: 'Makanan' },
  { id: 'umkm', label: 'UMKM' },
  { id: 'langganan', label: 'Langganan' },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ProfileNavbar() {
  const [active, setActive] = useState('profil');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const darkEl = document.getElementById('dampak');
    if (!darkEl) return;

    const observer = new IntersectionObserver(
      (entries) => setOverDark(entries.some((e) => e.isIntersecting)),
      { rootMargin: '0px 0px -65% 0px' }
    );

    observer.observe(darkEl);
    return () => observer.disconnect();
  }, []);

  const handleNav = (id: string) => {
    setDrawerOpen(false);
    setActive(id);
    scrollToId(id);
  };

  const IconButton = ({
    label,
    children,
    onClick,
    badge,
  }: {
    label: string;
    children: React.ReactNode;
    onClick?: () => void;
    badge?: number;
  }) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200',
        overDark
          ? 'text-white/80 hover:bg-white/10 hover:text-white'
          : 'text-charcoal-500 hover:bg-cream-100 hover:text-green-700',
        FOCUS_RING
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            'absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold transition-colors duration-500',
            overDark ? 'bg-gold-500 text-charcoal-900' : 'bg-green-700 text-white'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-3 sm:px-8 sm:pt-4">
        <div className="mx-auto w-full max-w-[1200px]">
          <nav
            className={cn(
              'flex h-16 items-center justify-between rounded-full border px-4 shadow-[0_20px_44px_-26px_rgba(47,66,53,0.45)] backdrop-blur-xl transition-colors duration-500 sm:px-5 lg:px-7',
              overDark
                ? 'border-white/15 bg-forest-dark/75 text-white'
                : 'border-hairline/70 bg-cream/80 text-forest-dark'
            )}
          >

            <Link
              href="/"
              className={cn('flex shrink-0 items-center gap-2 rounded-full', FOCUS_RING)}
            >
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500',
                  overDark ? 'bg-white text-forest-dark' : 'bg-green-700 text-white'
                )}
              >
                <Leaf className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  'font-sans text-xl font-bold tracking-tight transition-colors duration-500',
                  overDark ? 'text-white' : 'text-green-700'
                )}
              >
                ReBites
              </span>
            </Link>


            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(link.id);
                    }}
                    aria-current={active === link.id ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-3 py-2 font-inter text-sm transition-colors duration-200 xl:px-4',
                      active === link.id
                        ? overDark
                          ? 'bg-white/15 font-semibold text-white'
                          : 'bg-cream-100 font-semibold text-green-700'
                        : overDark
                          ? 'text-white/75 hover:text-white'
                          : 'text-charcoal-500 hover:text-green-700',
                      FOCUS_RING
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>


            <div className="flex items-center gap-1 sm:gap-0.5">

              <div className="relative hidden lg:block">
                <button
                  type="button"
                  aria-label="Pilih lokasi"
                  aria-expanded={locationOpen}
                  onClick={() => setLocationOpen((v) => !v)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200',
                    overDark
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-charcoal-500 hover:bg-cream-100 hover:text-green-700',
                    FOCUS_RING
                  )}
                >
                  <MapPin
                    className={cn(
                      'h-4 w-4 transition-colors duration-500',
                      overDark ? 'text-gold-500' : 'text-green-700'
                    )}
                  />
                  <span className="max-w-[100px] truncate">{location}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      locationOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {locationOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setLocationOpen(false)}
                      />
                      <motion.ul
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-sage-100 bg-white p-1.5 text-forest-dark shadow-xl"
                      >
                        {LOCATIONS.map((loc) => (
                          <li key={loc}>
                            <button
                              type="button"
                              onClick={() => {
                                setLocation(loc);
                                setLocationOpen(false);
                              }}
                              className={cn(
                                'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150',
                                loc === location
                                  ? 'bg-cream-100 font-semibold text-green-700'
                                  : 'text-charcoal-500 hover:bg-cream-50 hover:text-green-700'
                              )}
                            >
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              {loc}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    </>
                  )}
                </AnimatePresence>
              </div>


              <div className="hidden items-center gap-0.5 sm:flex">
                <IconButton label="Profil saya">
                  <User className="h-5 w-5" />
                </IconButton>
              </div>

              <button
                type="button"
                aria-label="Buka menu navigasi"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen((v) => !v)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 lg:hidden',
                  overDark ? 'text-white' : 'text-forest-dark',
                  FOCUS_RING
                )}
              >
                {drawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </nav>
        </div>
      </header>


      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[55] bg-forest-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-[60] flex h-full w-72 flex-col bg-cream-50 p-5 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white">
                    <Leaf className="h-4 w-4" />
                  </span>
                  <span className="font-sans text-xl font-bold text-green-700">
                    ReBites
                  </span>
                </span>
                <button
                  type="button"
                  aria-label="Tutup menu"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal-900 hover:bg-cream-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(link.id);
                      }}
                      className={cn(
                        'block rounded-xl px-4 py-3 font-inter text-sm transition-colors duration-150',
                        active === link.id
                          ? 'bg-cream-100 font-semibold text-green-700'
                          : 'text-charcoal-500 hover:bg-cream-100 hover:text-green-700'
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-sage-100 pt-5">
                <p className="font-inter text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                  Lokasi
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLocation(
                      LOCATIONS[
                        (LOCATIONS.indexOf(location) + 1) % LOCATIONS.length
                      ]
                    );
                  }}
                  className="mt-2 flex items-center gap-2 text-sm font-medium text-green-700"
                >
                  <MapPin className="h-4 w-4" />
                  {location}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export { ProfileNavbar as Navbar };
