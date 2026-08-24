'use client';

import type { OrderReview } from './types';

const REVIEWS_KEY = 'rebites-reviews';

function readReviews(): OrderReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(REVIEWS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getReviewFor(
  orderId: string,
  userId: string
): OrderReview | undefined {
  return readReviews().find((r) => r.orderId === orderId && r.userId === userId);
}

export function saveReview(review: OrderReview): void {
  const reviews = readReviews().filter(
    (r) => !(r.orderId === review.orderId && r.userId === review.userId)
  );
  window.localStorage.setItem(
    REVIEWS_KEY,
    JSON.stringify([review, ...reviews].slice(0, 100))
  );
}
