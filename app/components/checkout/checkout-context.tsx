'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  Vendor,
} from '@/lib/types';
import { useOrderCalculation } from '@/lib/useOrderCalculation';
import {
  estimateOrderMinutes,
  getVendorPreparationMinutes,
} from '@/lib/delivery-estimate';
import {
  createOrderId,
  reserveStock,
  saveOrder,
} from '@/lib/order-storage';
import {
  createNotification,
  getUmkmOwnerUserId,
} from '@/lib/notification-storage';
import { settleOrderCoins, useRebitesCoins } from '@/hooks/use-rebites-coins';
import { useCurrentUser } from '@/lib/current-user';
import {
  useAddresses,
  type AddressFormValues,
} from '@/hooks/use-addresses';
import { formatRupiah } from '@/lib/data';
import { fetchVendors, validatePromoCode } from '@/lib/catalog';
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

  coinBalance: number;
  useCoins: boolean;
  toggleUseCoins: (on: boolean) => void;

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
  const { user } = useCurrentUser();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  useEffect(() => {
    fetchVendors().then(setVendors);
  }, []);

  const [quantity, setQuantity] = useState(initialQuantity);
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>('pickup');
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [useCoins, setUseCoins] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { balance: coinBalance } = useRebitesCoins();

  const submittedRef = useRef(false);
  const {
    addresses,
    selectedAddress,
    selectedAddressId,
    selectAddress,
    addAddress,
    updateAddress,
  } = useAddresses();

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

  const selectMethod = useCallback((id: string) => setSelectedMethodId(id), []);

  const selectedMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedMethodId) ?? null,
    [selectedMethodId]
  );

  const applyPromo = useCallback(() => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    validatePromoCode(code).then((match) => {
      if (match) {
        setPromo(match);
        setPromoError(null);
      } else {
        setPromo(null);
        setPromoError('Kode promo tidak valid');
      }
    });
  }, [promoInput]);

  const clearPromo = useCallback(() => {
    setPromo(null);
    setPromoInput('');
    setPromoError(null);
  }, []);

  const summary = useOrderCalculation({
    draft,
    quantity,
    fulfillment,
    promo,
    useCoins,
    coinBalance,
  });

  const toggleUseCoins = useCallback(
    (on: boolean) => setUseCoins(on && coinBalance > 0),
    [coinBalance],
  );

  const missingRequirement = useMemo<string | null>(() => {
    if (!selectedMethod && summary.total > 0)
      return 'Pilih metode pembayaran terlebih dahulu.';
    if (fulfillment === 'delivery' && !selectedAddress)
      return 'Pilih alamat pengiriman terlebih dahulu.';
    return null;
  }, [selectedMethod, fulfillment, selectedAddress, summary.total]);

  const canPay = missingRequirement === null && !submitting;

  const submitOrder = useCallback(() => {
    if (submitting || submittedRef.current) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!selectedMethod && summary.total > 0) return;
    if (fulfillment === 'delivery' && !selectedAddress) return;

    submittedRef.current = true;
    setSubmitting(true);

    (async () => {
      try {
        // 1. Kunci stok secara atomik; batal kalau stok kurang.
        const reserved = await reserveStock(draft.productId, quantity);
        if (!reserved) {
          setSubmitting(false);
          submittedRef.current = false;
          setPromoError('Stok tidak mencukupi, pesanan dibatalkan.');
          return;
        }

        const orderId = createOrderId();
        const createdAt = new Date().toISOString();

        const estimate = estimateOrderMinutes({
          fulfillment,
          distanceKm: draft.distanceKm,
          vendorSlug: draft.vendorSlug,
        });
        const estimatedCompletionAt = new Date(
          Date.now() + estimate.estimatedMinutes * 60_000
        ).toISOString();

        const vendorInfo = vendors.find((v) => v.id === draft.vendorSlug);

        const order: StoredOrder = {
          orderId,
          userId: user.id,
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
          paymentMethodId: selectedMethod?.id ?? 'tanpa-pembayaran',
          subtotal: summary.subtotal,
          discount: summary.discount,
          serviceFee: summary.serviceFee,
          deliveryFee: summary.deliveryFee,
          totalBeforeCoin: summary.totalBeforeCoin,
          coinUsed: summary.coinUsed,
          total: summary.total,
          coinEarned: summary.coinEarned,
          createdAt,

          unitPrice: draft.discountedPrice,
          promoCode: promo?.code ?? null,
          status: 'ongoing',
          estimatedMinutes: estimate.estimatedMinutes,
          estimatedCompletionAt,
          completedAt: undefined,
          distanceKm: fulfillment === 'delivery' ? draft.distanceKm : undefined,
          vendorAddress: vendorInfo?.address ?? draft.pickupLocation,
          vendorOpenHours: vendorInfo?.openHours,
          preparationMinutes:
            estimate.preparationMinutes ||
            getVendorPreparationMinutes(draft.vendorSlug),
          co2eSavedKg: draft.co2ePerUnitKg * quantity,
        };

        await saveOrder(order);
        settleOrderCoins(order.orderId, {
          spent: summary.coinUsed,
          earned: summary.coinEarned,
        });

        const buyerUserId = user.id;
        const paymentMethodName =
          paymentMethods.find((m) => m.id === selectedMethod?.id)?.name ?? '—';

        createNotification({
          userId: buyerUserId,
          role: 'buyer',
          type: 'payment_success',
          title: 'Pembayaran Berhasil',
          message: `Pembayaran ${formatRupiah(order.total)} untuk pesanan ${order.productName} telah berhasil diproses melalui ${paymentMethodName}.`,
          referenceId: orderId,
          href: `/riwayatPesanan`,
        });

        createNotification({
          userId: buyerUserId,
          role: 'buyer',
          type: 'order_created',
          title: 'Pesanan Berhasil Dibuat',
          message: `Pesanan #${orderId} dari ${order.vendorName} sedang diproses. Estimasi ${order.estimatedMinutes ?? 20} menit.`,
          referenceId: orderId,
          href: `/riwayatPesanan`,
        });

        const sellerUserId =
          (await getUmkmOwnerUserId(order.vendorSlug)) ?? null;
        if (sellerUserId) {
          const buyerName =
            order.addressSnapshot?.receiverName ?? 'Pembeli';
          createNotification({
            userId: sellerUserId,
            role: 'seller',
            type: 'incoming_order',
            title: 'Pesanan Masuk!',
            message: `${buyerName} memesan ${order.productName}${order.quantity > 1 ? ` ×${order.quantity}` : ''} seharga ${formatRupiah(order.total)}. Segera siapkan pesanan.`,
            referenceId: orderId,
            href: `/dashboard/penjual/pesanan`,
          });
        }

        router.push(
          `/detail/pesanan/sukses?orderId=${encodeURIComponent(orderId)}`
        );
      } catch (error) {
        console.error('[checkout] gagal memproses pesanan:', error);
        setSubmitting(false);
        submittedRef.current = false;
        setPromoError('Terjadi kesalahan saat memproses pesanan.');
      }
    })();
  }, [
    draft,
    fulfillment,
    promo,
    quantity,
    router,
    selectedAddress,
    selectedMethod,
    submitting,
    summary,
    user,
    vendors,
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
      coinBalance,
      useCoins,
      toggleUseCoins,
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
      coinBalance,
      useCoins,
      toggleUseCoins,
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
