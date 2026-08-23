'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import type {
  DeliveryAddress,
  FulfillmentMode,
  OrderDraft,
  PaymentMethod,
  PromoCode,
  StoredOrder,
} from '@/lib/types';
import { useOrderCalculation } from '@/lib/useOrderCalculation';
import { createOrderId, saveOrder } from '@/lib/order-storage';
import { grantCoinsForOrder } from '@/hooks/use-rebites-coins';
import {
  useAddresses,
  type AddressFormValues,
} from '@/hooks/use-addresses';
import { promoCodes } from '@/lib/data';
import { paymentMethods } from './payment-methods';

interface CheckoutContextValue {
  draft: OrderDraft;
  methods: PaymentMethod[];
  quantity: number;
  increment: () => void;
  decrement: () => void;
  canDecrement: boolean;
  canIncrement: boolean;

  fulfillment: FulfillmentMode;
  setFulfillment: (mode: FulfillmentMode) => void;

  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress | null;
  selectedAddressId: string | null;
  selectAddress: (id: string) => void;
  addAddress: (values: AddressFormValues) => void;
  updateAddress: (id: string, values: AddressFormValues) => void;

  selectedMethod: PaymentMethod | null;
  selectMethod: (id: string) => void;

  promo: PromoCode | null;
  promoInput: string;
  setPromoInput: (value: string) => void;
  promoError: string | null;
  applyPromo: () => void;
  clearPromo: () => void;

  summary: ReturnType<typeof useOrderCalculation>;
  canPay: boolean;
  missingRequirement: string | null;
  submitting: boolean;
  submitOrder: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}

export function CheckoutProvider({
  draft,
  initialQuantity = 1,
  children,
}: {
  draft: OrderDraft;
  initialQuantity?: number;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>('pickup');
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submittedRef = useRef(false);
  const {
    addresses,
    selectedAddress,
    selectedAddressId,
    selectAddress,
    addAddress,
    updateAddress,
  } = useAddresses();

  /* ── Quantity ── */
  const increment = useCallback(
    () =>
      setQuantity((q) =>
        Math.min(draft.stockRemaining, Math.max(1, q + 1))
      ),
    [draft.stockRemaining]
  );

  const decrement = useCallback(
    () => setQuantity((q) => Math.max(1, q - 1)),
    []
  );

  /* ── Payment method ── */
  const selectMethod = useCallback((id: string) => setSelectedMethodId(id), []);

  const selectedMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedMethodId) ?? null,
    [selectedMethodId]
  );

  /* ── Promo ── */
  const applyPromo = useCallback(() => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const match = promoCodes.find(
      (p) => p.code.toUpperCase() === code && p.isValid
    );
    if (match) {
      setPromo(match);
      setPromoError(null);
    } else {
      setPromo(null);
      setPromoError('Kode promo tidak valid');
    }
  }, [promoInput]);

  const clearPromo = useCallback(() => {
    setPromo(null);
    setPromoInput('');
    setPromoError(null);
  }, []);

  /* ── Kalkulasi & validasi ── */
  const summary = useOrderCalculation({
    draft,
    quantity,
    fulfillment,
    promo,
  });

  const missingRequirement = useMemo<string | null>(() => {
    if (!selectedMethod) return 'Pilih metode pembayaran terlebih dahulu.';
    if (fulfillment === 'delivery' && !selectedAddress)
      return 'Pilih alamat pengiriman terlebih dahulu.';
    return null;
  }, [selectedMethod, fulfillment, selectedAddress]);

  const canPay = missingRequirement === null && !submitting;

  /* ── Submit order ──
     Coin diberikan HANYA di sini (sekali per orderId), bukan saat
     halaman sukses dibuka — aman dari refresh/double click. */
  const submitOrder = useCallback(() => {
    if (!selectedMethod || submitting || submittedRef.current) return;
    if (fulfillment === 'delivery' && !selectedAddress) return;

    submittedRef.current = true;
    setSubmitting(true);

    const orderId = createOrderId();
    const order: StoredOrder = {
      orderId,
      productId: draft.productId,
      productName: draft.productName,
      vendorName: draft.vendorName,
      vendorSlug: draft.vendorSlug,
      image: draft.image,
      quantity,
      fulfillment,
      addressSnapshot:
        fulfillment === 'delivery' && selectedAddress
          ? {
              label: selectedAddress.label,
              receiverName: selectedAddress.receiverName,
              phone: selectedAddress.phone,
              province: selectedAddress.province,
              city: selectedAddress.city,
              district: selectedAddress.district,
              fullAddress: selectedAddress.fullAddress,
              note: selectedAddress.note,
            }
          : null,
      paymentMethodId: selectedMethod.id,
      subtotal: summary.subtotal,
      discount: summary.discount,
      serviceFee: summary.serviceFee,
      deliveryFee: summary.deliveryFee,
      total: summary.total,
      coinEarned: summary.coinEarned,
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    grantCoinsForOrder(order.orderId, summary.coinEarned);
    router.push(`/detail/pesanan/sukses?orderId=${encodeURIComponent(orderId)}`);
  }, [
    draft,
    fulfillment,
    quantity,
    router,
    selectedAddress,
    selectedMethod,
    submitting,
    summary,
  ]);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      draft,
      methods: paymentMethods,
      quantity,
      increment,
      decrement,
      canDecrement: quantity > 1,
      canIncrement: quantity < draft.stockRemaining,
      fulfillment,
      setFulfillment,
      addresses,
      selectedAddress,
      selectedAddressId,
      selectAddress,
      addAddress,
      updateAddress,
      selectedMethod,
      selectMethod,
      promo,
      promoInput,
      setPromoInput,
      promoError,
      applyPromo,
      clearPromo,
      summary,
      canPay,
      missingRequirement,
      submitting,
      submitOrder,
    }),
    [
      draft,
      quantity,
      increment,
      decrement,
      fulfillment,
      addresses,
      selectedAddress,
      selectedAddressId,
      selectAddress,
      addAddress,
      updateAddress,
      selectedMethod,
      selectMethod,
      promo,
      promoInput,
      promoError,
      applyPromo,
      clearPromo,
      summary,
      canPay,
      missingRequirement,
      submitting,
      submitOrder,
    ]
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}
