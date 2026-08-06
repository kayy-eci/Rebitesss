'use client';

import Link from 'next/link';
import { Leaf, Instagram, Mail, MapPin } from 'lucide-react';
import { Reveal } from './reveal';

export function SiteFooter() {
  return (
    <footer className="grain-overlay relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <Reveal className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-baseline gap-0.5">
              <span className="font-display text-3xl font-medium text-primary-foreground-strong">
                Re
              </span>
              <span className="font-display text-3xl font-light italic text-primary-foreground-strong">
                Bites
              </span>
            </Link>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-primary-foreground/70">
              Marketplace yang menyelamatkan makanan surplus dari dapur UMKM
              kuliner Indonesia sebelum menjadi food waste.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-primary-foreground/60 hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="mailto:halo@rebites.id"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-primary-foreground/60 hover:text-primary-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-primary-foreground/50">
              Platform
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/#cara-kerja"
                  className="font-sans text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link
                  href="/#umkm"
                  className="font-sans text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Untuk UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/#pembeli"
                  className="font-sans text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Untuk Pembeli
                </Link>
              </li>
              <li>
                <Link
                  href="/#langganan"
                  className="font-sans text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Paket Langganan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-primary-foreground/50">
              Akun
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/login"
                  className="font-sans text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Masuk
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="font-sans text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Daftar UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="font-sans text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Daftar Pembeli
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-primary-foreground/50">
              Kontak
            </h4>
            <ul className="mt-5 space-y-3 font-sans text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60" />
                halo@rebites.id
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60" />
                SMK Taruna Bhakti, Kota Bogor
              </li>
            </ul>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-primary-foreground/15 pt-8 sm:flex-row sm:items-center">
          <p className="font-sans text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} ReBites. Dibuat oleh{' '}
            <span className="text-primary-foreground/80">Tim Sixquit</span> —
            SMK Taruna Bhakti.
          </p>
          <div className="flex items-center gap-2 font-sans text-xs text-primary-foreground/50">
            <Leaf className="h-3.5 w-3.5" />
            Setiap makanan yang terselamatkan punya cerita.
          </div>
        </div>
      </div>
    </footer>
  );
}
