'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/#masalah', label: 'Food Waste' },
  { href: '/#cara-kerja', label: 'Cara Kerja' },
  { href: '/#umkm', label: 'UMKM' },
  { href: '/#pembeli', label: 'Pembeli' },
  { href: '/#langganan', label: 'Langganan' },
];

const DARK_SECTIONS = ['masalah', 'cta'];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = DARK_SECTIONS.map((id) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        setOverDark(entries.some((e) => e.isIntersecting));
      },
      { rootMargin: '0px 0px -55% 0px' }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-500',
          overDark
            ? scrolled
              ? 'bg-primary/85 backdrop-blur-md border-b border-primary-foreground/10'
              : 'bg-transparent'
            : scrolled
              ? 'bg-background/85 backdrop-blur-md border-b border-border/60'
              : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
          <Link href="/" className="group flex items-baseline gap-0.5">
            <span
              className={cn(
                'font-display text-2xl font-medium tracking-tight lg:text-[26px] transition-colors',
                overDark ? 'text-primary-foreground' : 'text-primary'
              )}
            >
              Re
            </span>
            <span
              className={cn(
                'font-display text-2xl font-light italic tracking-tight lg:text-[26px] transition-colors',
                overDark ? 'text-primary-foreground' : 'text-primary'
              )}
            >
              Bites
            </span>
            <Leaf
              className={cn(
                'ml-1 h-4 w-4 transition-transform duration-500 group-hover:rotate-12',
                overDark ? 'text-primary-foreground/70' : 'text-primary/60'
              )}
            />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'group relative font-sans text-[13px] font-medium tracking-tight transition-colors',
                    overDark
                      ? 'text-primary-foreground'
                      : 'text-foreground/80 hover:text-primary'
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100',
                      overDark ? 'bg-primary-foreground' : 'bg-primary'
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className={cn(
                'font-sans text-[13px] font-medium transition-colors',
                overDark
                  ? 'text-primary-foreground'
                  : 'text-foreground/80 hover:text-primary'
              )}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[var(--radius)] bg-primary px-5 py-2.5 font-sans text-[13px] font-medium text-primary-foreground-strong transition-all duration-300 hover:shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.5)]"
            >
              <span className="relative z-10e text-white">Register</span>
              <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-primary-foreground-strong transition-transform duration-300 group-hover:scale-150" />
            </Link>
          </div>

          <button
            className={cn(
              'flex h-10 w-10 items-center justify-center transition-colors lg:hidden',
              overDark ? 'text-primary-foreground' : 'text-primary'
            )}
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-primary lg:hidden"
          >
            <div className="grain-overlay flex h-full flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-primary-foreground">
                  ReBites
                </span>
                <button
                  className="flex h-10 w-10 items-center justify-center text-primary-foreground"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <ul className="mt-16 flex flex-col gap-2">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i + 0.1 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 font-display text-4xl font-light text-primary-foreground/90"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-[var(--radius)] border border-primary-foreground/30 py-3 text-center font-sans text-sm text-primary-foreground"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-[var(--radius)] bg-secondary py-3 text-center font-sans text-sm font-medium text-primary"
                >
                  Mulai Gratis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
