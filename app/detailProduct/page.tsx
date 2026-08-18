import type { Metadata } from 'next';
import DetailPage from '@/app/components/detail/detail-page';
import { PRODUCT } from './data';

export const metadata: Metadata = {
  title: `${PRODUCT.title} - ReBites`,
  description: PRODUCT.description,
};

export default function DetailProductPage() {
  return <DetailPage />;
}
