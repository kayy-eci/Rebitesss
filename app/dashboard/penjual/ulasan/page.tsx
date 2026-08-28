'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Store } from 'lucide-react';
import { SellerShell } from '@/app/components/dashboardPenjual/SellerShell';
import { Card } from '@/app/components/dashboardPenjual/Card';
import { StoreRatingCard } from '@/app/components/dashboardPenjual/StoreRatingCard';
import { getSellerUmkm } from '@/lib/product-storage';
import { getSellerReviews, REVIEWS_UPDATED_EVENT, type SellerReview } from '@/lib/review-storage';
import { cn } from '@/lib/utils';

function formatReviewDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn('h-3.5 w-3.5', n <= rating ? 'fill-gold-500 text-gold-500' : 'fill-sage-100 text-sage-100')}
        />
      ))}
    </span>
  );
}

function ReviewItem({ review }: { review: SellerReview }) {
  return (
    <li className="flex gap-3 rounded-2xl border border-sage-100 bg-white p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sage-100 text-[11px] font-bold text-sage-600">
        {review.authorAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.authorAvatar} alt={review.authorName} className="h-full w-full object-cover" />
        ) : (
          review.authorName.slice(0, 2).toUpperCase()
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-charcoal-900">{review.authorName}</p>
          <Stars rating={review.rating} />
          <span className="text-xs text-sage-500">· {formatReviewDate(review.createdAt)}</span>
        </div>
        <p className="mt-1 text-xs font-medium text-sage-500">
          {review.menuName || 'Menu'} · <span className="font-mono">#{review.orderCode}</span>
        </p>
        {review.comment ? (
          <p className="mt-2 break-words rounded-xl bg-cream-50 px-3 py-2 text-[13px] leading-relaxed text-charcoal-900">
            “{review.comment}”
          </p>
        ) : (
          <p className="mt-2 text-xs italic text-sage-400">Tanpa komentar</p>
        )}
      </div>
    </li>
  );
}

export default function UlasanPage() {
  const [storeName, setStoreName] = useState('');
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | 'all'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getSellerReviews();
    setReviews(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getSellerUmkm().then((umkm) => {
      if (umkm) setStoreName(umkm.businessName);
    });
    load();
    const onUpdate = () => load();
    window.addEventListener(REVIEWS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(REVIEWS_UPDATED_EVENT, onUpdate);
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') return reviews;
    return reviews.filter((r) => r.rating === filter);
  }, [reviews, filter]);

  const avg = useMemo(() => {
    if (reviews.length === 0) return 0;
    return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  }, [reviews]);

  return (
    <SellerShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">Dashboard Penjual</p>
        <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-primary">
          Ulasan Pelanggan
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-sage-500">
          <Store className="h-3.5 w-3.5" />
          Penilaian untuk {storeName || 'tokomu'} · {reviews.length} ulasan · Rata-rata {avg.toFixed(1)}/5.0
        </p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <StoreRatingCard />
          <Card className="mt-5">
            <h3 className="text-sm font-bold text-charcoal-900">Filter Rating</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['all', 5, 4, 3, 2, 1] as const).map((f) => (
                <button
                  key={String(f)}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                    filter === f ? 'bg-primary text-white' : 'border border-sage-100 bg-white text-charcoal-500 hover:text-charcoal-900'
                  )}
                >
                  {f === 'all' ? 'Semua' : `${f}★`}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-sage-500">
              Menampilkan {filtered.length} dari {reviews.length} ulasan
            </p>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {loading ? (
            <Card className="py-10 text-center text-sm text-sage-500">Memuat ulasan...</Card>
          ) : filtered.length === 0 ? (
            <Card className="flex flex-col items-center justify-center gap-4 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-primary">
                <MessageSquare className="h-6 w-6" />
              </span>
              <div className="max-w-sm">
                <p className="text-sm font-bold text-charcoal-900">
                  {reviews.length === 0 ? 'Belum ada ulasan' : 'Tidak ada ulasan pada filter ini'}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-sage-500">
                  {reviews.length === 0
                    ? 'Ulasan pembeli akan muncul di sini setelah pesanan selesai dan pembeli memberi penilaian bintang & komentar.'
                    : 'Coba pilih filter lain untuk melihat ulasan dengan rating berbeda.'}
                </p>
              </div>
            </Card>
          ) : (
            <ul className="space-y-3">
              {filtered.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </SellerShell>
  );
}
