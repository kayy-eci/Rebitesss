'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: 'Apakah pembayaran aman?',
    answer:
      'Ya. Seluruh transaksi diproses lewat gateway Midtrans dengan enkripsi penuh. Data kartu atau akun kamu tidak pernah disimpan oleh ReBites.',
  },
  {
    question: 'Bagaimana jika saya batalkan pesanan?',
    answer:
      'Kamu bisa membatalkan pesanan kapan saja sebelum jangka waktu ambil berakhir. Tombol pembatalan tersedia di halaman profil pada detail pesanan aktif.',
  },
  {
    question: 'Kapan dana dikembalikan jika pesanan gagal diambil?',
    answer:
      'Dana ditahan sampai pesanan berhasil diambil. Jika pesanan tidak diambil hingga waktu berakhir, dana otomatis dikembalikan penuh ke saldo awal dalam 1–3 hari kerja.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-display text-base font-medium text-charcoal-900">
        Pertanyaan seputar pembayaran
      </h3>

      <div className="mt-2 divide-y divide-sage-100">
        {FAQS.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.question}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
              >
                <span className="text-sm font-semibold text-charcoal-900">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    open ? 'bg-green-700 text-white' : 'bg-sage-100 text-green-700'
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 pr-10 text-sm leading-relaxed text-charcoal-500">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
