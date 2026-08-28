import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function StoreHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-sage-100 bg-cream-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="ReBites beranda">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-sans text-xl font-bold tracking-tight text-primary">
            ReBites
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-full border border-sage-100 bg-white px-4 py-2 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-cream-50 sm:inline-flex"
          >
            Cari Makanan
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-caramel"
          >
            Masuk / Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
