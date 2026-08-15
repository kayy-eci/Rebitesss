import type { Metadata } from 'next';
import DetailPage from '@/app/detailProduk/detail-page';
import { PRODUCT } from '@/app/detailProduk/data';

export const metadata: Metadata = {
  title: `${PRODUCT.title} - ReBites`,
  description: PRODUCT.description,
};

export default function DetailProductPage() {
  return <DetailPage />;
}
