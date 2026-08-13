import Link from 'next/link';
import {
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Music2,
  Phone,
  Twitter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoftBlob } from './Ornaments';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-800';

const LINK_CLASS =
  'font-inter text-sm text-cream-50/75 transition-colors duration-200 hover:text-cream-50';

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-forest-800 text-cream-50"
    >
      <SoftBlob className="-left-24 -bottom-24 h-96 w-96 bg-white/5" />
      <SoftBlob className="-right-20 -top-24 h-80 w-80 bg-green-700/30" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="#home" className="flex items-center gap-2" aria-label="ReBites">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 text-green-700">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-sans text-xl font-bold tracking-tight text-cream-50">
                ReBites
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-inter text-sm leading-relaxed text-cream-50/70">
              Marketplace yang mempertemukan pembeli dengan UMKM untuk
              menyelamatkan makanan surplus yang masih layak konsumsi.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter / X' },
                { icon: Music2, label: 'TikTok' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#home"
                  aria-label={label}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/20 text-cream-50/80 transition-colors duration-200 hover:border-cream-50/60 hover:text-cream-50',
                    FOCUS_RING
                  )}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Untuk Pembeli */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cream-50/50">
              Untuk Pembeli
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <a href="#explore" className={LINK_CLASS}>
                  Explore Food
                </a>
              </li>
              <li>
                <a href="#how-it-works" className={LINK_CLASS}>
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#umkm" className={LINK_CLASS}>
                  Pilihan UMKM
                </a>
              </li>
              <li>
                <a href="#home" className={LINK_CLASS}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Untuk UMKM */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cream-50/50">
              Untuk UMKM
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <a href="#umkm-cta" className={LINK_CLASS}>
                  Mulai Jual
                </a>
              </li>
              <li>
                <Link href="/register" className={LINK_CLASS}>
                  Daftar UMKM
                </Link>
              </li>
              <li>
                <a href="#home" className={LINK_CLASS}>
                  Syarat &amp; Ketentuan
                </a>
              </li>
              <li>
                <a href="#home" className={LINK_CLASS}>
                  Bantuan UMKM
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cream-50/50">
              Kontak
            </h4>
            <ul className="mt-5 space-y-3 font-inter text-sm text-cream-50/75">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold-500" />
                halo@rebites.id
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold-500" />
                +62 812-3456-7890
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                Jl. KH. Sholeh Iskandar, Kedung Badak,
                <br />
                Kota Bogor, Jawa Barat
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-inter text-xs text-cream-50/50">
            © {new Date().getFullYear()} ReBites. Dibuat oleh Tim Sixquit —
            SMK Taruna Bhakti.
          </p>
          <p className="flex items-center gap-2 font-inter text-xs text-cream-50/50">
            <Leaf className="h-3.5 w-3.5 text-gold-500" />
            Setiap makanan yang terselamatkan punya cerita.
          </p>
        </div>
      </div>
    </footer>
  );
}
