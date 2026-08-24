'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  AddressLabel,
  DeliveryAddress,
} from '@/lib/types';

const STORAGE_KEY_ADDRESSES = 'rebites-addresses';
const STORAGE_KEY_SELECTED = 'rebites-selected-address-id';

export interface AddressFormValues {
  label: AddressLabel;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  fullAddress: string;
  note?: string;
}

const DEFAULT_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-rumah',
    label: 'Rumah',
    receiverName: 'Arga',
    phone: '081234567890',
    province: 'Jawa Barat',
    city: 'Bogor',
    district: 'Bogor Utara',
    fullAddress: 'Jl. Contoh No. 123, Tegal Gundil',
    note: 'Titip di pos ronda jika saya sedang keluar.',
  },
];

function loadAddresses(): DeliveryAddress[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_ADDRESSES);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeliveryAddress[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.filter((item) => item && item.id && item.fullAddress);
  } catch {
    return null;
  }
}

function loadSelectedId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY_SELECTED);
}

function createAddressId(): string {
  return `addr-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function useAddresses() {
  const [addresses, setAddresses] =
    useState<DeliveryAddress[]>(DEFAULT_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    DEFAULT_ADDRESSES[0].id
  );

  useEffect(() => {
    const stored = loadAddresses();
    if (stored) setAddresses(stored);
    const list = stored ?? DEFAULT_ADDRESSES;
    const storedId = loadSelectedId();
    setSelectedAddressId(
      storedId && list.some((item) => item.id === storedId)
        ? storedId
        : list[0].id
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY_ADDRESSES,
      JSON.stringify(addresses)
    );
  }, [addresses]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY_SELECTED, selectedAddressId);
  }, [selectedAddressId]);

  const selectAddress = useCallback((id: string) => {
    setSelectedAddressId(id);
  }, []);

  const addAddress = useCallback((values: AddressFormValues) => {
    const newAddress: DeliveryAddress = { id: createAddressId(), ...values };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    return newAddress;
  }, []);

  const updateAddress = useCallback(
    (id: string, values: AddressFormValues) => {
      setAddresses((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...values } : item))
      );
    },
    []
  );

  const selectedAddress = useMemo(
    () =>
      addresses.find((item) => item.id === selectedAddressId) ??
      addresses[0] ??
      null,
    [addresses, selectedAddressId]
  );

  return {
    addresses,
    selectedAddress,
    selectedAddressId: selectedAddress?.id ?? null,
    selectAddress,
    addAddress,
    updateAddress,
  };
}
