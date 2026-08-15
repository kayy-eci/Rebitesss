'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  OrderDraft,
  PaymentMethod,
  PromoCode,
} from '@/lib/types';
import { useOrderCalculation } from '@/lib/useOrderCalculation';
import { paymentMethods } from './payment-methods';

interface CheckoutContextValue {
  draft: OrderDraft;
  methods: PaymentMethod[];
  promoCodes: PromoCode[];
  quantity: number;
  increment: () => void;
  decrement: () => void;
  canDecrement: boolean;
  canIncrement: boolean;
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
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}

export function CheckoutProvider({
  draft,
  promoCodes,
  children,
}: {
  draft: OrderDraft;
  promoCodes: PromoCode[];
  children: React.ReactNode;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

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
  }, [promoInput, promoCodes]);

  const clearPromo = useCallback(() => {
    setPromo(null);
    setPromoInput('');
    setPromoError(null);
  }, []);

  const selectedMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedMethodId) ?? null,
    [selectedMethodId]
  );

  const summary = useOrderCalculation(draft, quantity, selectedMethod, promo);

  const canPay = selectedMethod !== null;

  const value = useMemo<CheckoutContextValue>(
    () => ({
      draft,
      methods: paymentMethods,
      promoCodes,
      quantity,
      increment,
      decrement,
      canDecrement: quantity > 1,
      canIncrement: quantity < draft.stockRemaining,
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
    }),
    [
      draft,
      promoCodes,
      quantity,
      increment,
      decrement,
      selectedMethod,
      selectMethod,
      promo,
      promoInput,
      promoError,
      applyPromo,
      clearPromo,
      summary,
      canPay,
    ]
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}
