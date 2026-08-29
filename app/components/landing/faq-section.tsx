'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/app/components/shared/reveal';

const FAQS = [
  {
    q: 'Apa itu ReBites?',
    a: 'ReBites adalah marketplace makanan surplus yang mempertemukan dapur UMKM dengan pembeli di Kota Depok. Makanan yang masih layak konsumsi namun berpotensi terbuang dijual dengan harga lebih hemat, mengurangi food waste sekaligus menambah pendapatan UMKM.',
  },
  {
    q: 'Bagaimana cara memesan makanan di ReBites?',
    a: 'Buat akun, jelajahi katalog makanan di sekitarmu, lalu checkout. Kamu bisa memilih mengambil sendiri pesanan di toko atau menggunakan layanan pengiriman yang tersedia.',
  },
  {
    q: 'Apakah makanan surplus aman dikonsumsi?',
    a: 'Aman. Makanan yang dijual adalah makanan yang masih layak konsumsi, biasanya kelebihan produksi atau mendekati jam penyajian berikutnya. Setiap penjual mencantumkan deskripsi dan jendela waktu pengambilan agar makanan dinikmati dalam kondisi terbaik.',
  },
  {
    q: 'Bagaimana cara UMKM mulai berjualan?',
    a: 'Daftar sebagai penjual melalui halaman registrasi, lengkapi profil toko, lalu unggah makanan surplus beserta harga diskonnya. Paket Trial tersedia gratis untuk mulai mencoba.',
  },
  {
    q: 'Berapa biaya untuk menggunakan ReBites?',
    a: 'Untuk pembeli, tidak ada biaya tambahan selain harga makanan. Untuk penjual, tersedia paket langganan mulai dari Trial gratis, Standar, hingga Premium sesuai kebutuhan usaha.',
  },
  {
    q: 'Area mana saja yang sudah dilayani?',
    a: 'Saat ini ReBites beroperasi khusus di Kota Depok sebagai langkah awal membangun ekosistem penyelamatan makanan berbasis komunitas sebelum meluas ke kota lain.',
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      data-nav="cream"
      className="grain-overlay relative overflow-hidden bg-white py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-xl text-center">
          <Reveal delay={0.05}>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              FAQ
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.1rem)] font-light leading-[1.08] tracking-[-0.02em] text-primary">
              Punya pertanyaan?{' '}
              <span className="italic text-caramel">Kami siap membantu.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-4 font-sans text-sm leading-[1.85] text-muted-foreground">
              Temukan jawaban cepat seputar cara kerja ReBites. Belum ketemu
              jawabannya? Hubungi kami langsung di bagian bawah.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid items-start gap-4 sm:grid-cols-2 lg:mt-14">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;

            return (
              <Reveal key={faq.q} delay={0.08 + i * 0.04}>
                <div
                  className={cn(
                    'rounded-[1.25rem] border p-6 transition-all duration-300',
                    isOpen
                      ? 'border-caramel bg-white shadow-[0_24px_48px_-32px_rgba(34,81,56,0.35)]'
                      : 'border-transparent bg-cream hover:border-caramel/50',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="font-sans text-base font-semibold tracking-tight text-primary">
                      {faq.q}
                    </span>

                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                        isOpen
                          ? 'rotate-45 bg-primary text-white'
                          : 'bg-cream-200/70 text-primary',
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 font-sans text-sm leading-[1.8] text-muted-foreground">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-[1.5rem] bg-primary px-8 py-8 text-center sm:flex-row sm:text-left lg:px-10">
            <div className="flex items-center gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 sm:flex">
                <Mail className="h-5 w-5 text-caramel" />
              </span>

              <div>
                <p className="font-display text-xl font-medium tracking-tight text-primary-foreground">
                  Masih punya pertanyaan lain?
                </p>

                <p className="mt-1 font-sans text-sm text-primary-foreground/70">
                  Tim kami siap membantu kamu setiap hari kerja.
                </p>
              </div>
            </div>

            <a
              href="mailto:halo@rebites.id"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-inter text-sm font-semibold text-primary shadow-[0_16px_32px_-18px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-caramel hover:text-white"
            >
              Hubungi Kami

              <Mail className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
