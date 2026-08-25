'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/lib/current-user';
import type { AddressLabel, DeliveryAddress } from '@/lib/types';

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

type AddressRow = Record<string, any>;

function rowToAddress(row: AddressRow): DeliveryAddress {
  return {
    id: row.id,
    label: row.label as AddressLabel,
    receiverName: row.receiver_name ?? '',
    phone: row.phone ?? '',
    province: row.province ?? '',
    city: row.city ?? '',
    district: row.district ?? '',
    fullAddress: row.full_address ?? '',
    note: row.note ?? undefined,
  };
}

function valuesToRow(values: AddressFormValues): AddressRow {
  return {
    label: values.label,
    receiver_name: values.receiverName,
    phone: values.phone,
    province: values.province,
    city: values.city,
    district: values.district,
    full_address: values.fullAddress,
    note: values.note ?? null,
  };
}

export function useAddresses() {
  const { userId, loading: userLoading } = useCurrentUser();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (userLoading) return;
    if (!userId) {
      setAddresses([]);
      setSelectedAddressId(null);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (!mounted) return;
      const list = error ? [] : (data ?? []).map(rowToAddress);
      setAddresses(list);
      const selected = list.find((item) => item.id) ?? null;
      setSelectedAddressId((prev) =>
        prev && list.some((item) => item.id === prev) ? prev : selected?.id ?? null
      );
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [userId, userLoading]);

  const selectAddress = useCallback(
    (id: string) => {
      setSelectedAddressId(id);
      if (!userId) return;
      (async () => {
        await supabase
          .from('addresses')
          .update({ is_selected: false })
          .eq('user_id', userId)
          .neq('id', id);
        await supabase.from('addresses').update({ is_selected: true }).eq('id', id);
      })();
    },
    [userId]
  );

  const addAddress = useCallback(
    async (values: AddressFormValues): Promise<DeliveryAddress | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('addresses')
        .insert({ user_id: userId, ...valuesToRow(values) })
        .select()
        .maybeSingle();
      if (error || !data) {
        console.error('[use-addresses] gagal menambah alamat:', error?.message);
        return null;
      }
      const created = rowToAddress(data);
      setAddresses((prev) => [...prev, created]);
      selectAddress(created.id);
      return created;
    },
    [userId, selectAddress]
  );

  const updateAddress = useCallback(
    async (id: string, values: AddressFormValues): Promise<void> => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('addresses')
        .update(valuesToRow(values))
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();
      if (error || !data) {
        console.error('[use-addresses] gagal memperbarui alamat:', error?.message);
        return;
      }
      const updated = rowToAddress(data);
      setAddresses((prev) => prev.map((item) => (item.id === id ? updated : item)));
    },
    [userId]
  );

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === selectedAddressId) ?? addresses[0] ?? null,
    [addresses, selectedAddressId]
  );

  return {
    addresses,
    selectedAddress,
    selectedAddressId: selectedAddress?.id ?? null,
    selectAddress,
    addAddress,
    updateAddress,
    loading,
  };
}
