'use client';

import { CreditCard, Landmark, QrCode, Smartphone } from 'lucide-react';
import type { PaymentMethod } from '@/lib/types';

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'qris',
    name: 'QRIS',
    description: 'Scan sekali langsung bayar',
    icon: QrCode,
    fee: 0,
    feeLabel: 'Tanpa biaya',
  },
  {
    id: 'ewallet',
    name: 'GoPay / ShopeePay',
    description: 'Bayar cepat dari e-wallet',
    icon: Smartphone,
    fee: 1000,
    feeLabel: '+Rp1.000',
  },
  {
    id: 'virtual-account',
    name: 'Virtual Account',
    description: 'Transfer ke nomor VA mandiri',
    icon: Landmark,
    fee: 4000,
    feeLabel: '+Rp4.000',
  },
  {
    id: 'kartu',
    name: 'Kartu Kredit / Debit',
    description: 'Visa, Mastercard, atau JCB',
    icon: CreditCard,
    fee: 2500,
    feeLabel: '+Rp2.500',
  },
];
