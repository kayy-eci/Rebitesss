-- ============================================================================
-- 0009: Langganan Max aktif untuk toko demo Dapur Ibu Tini
--   Toko demo yang dipakai tampilan Dashboard Penjual (slug 'dapur-ibu-tini')
--   diberikan paket ReBites Max (plans.slug = 'premium') berstatus active
--   selama 1 tahun sehingga seluruh fitur premium terbuka: Kategori Terlaris,
--   Menu Terlaris, Analisis Permintaan, Flash Sale tanpa batas, dan
--   Promosi Unggulan.
--
--   getSubscription() di lib/subscription-storage.ts mengambil row terbaru
--   (created_at desc, limit 1), jadi insert ini otomatis menang atas
--   langganan lama apa pun statusnya.
--
--   Idempotent: aman dijalankan berulang (guard NOT EXISTS).
-- ============================================================================

INSERT INTO public.subscriptions (
  umkm_id,
  plan_id,
  status,
  billing,
  price_paid,
  payment_method_id,
  current_period_start,
  current_period_end
)
SELECT
  u.id,
  p.id,
  'active',
  'yearly',
  p.price_yearly,
  NULL,
  now(),
  now() + interval '1 year'
FROM public.umkm_profiles u
JOIN public.plans p ON p.slug = 'premium'
WHERE u.slug = 'dapur-ibu-tini'
  AND NOT EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.umkm_id = u.id
      AND s.plan_id = p.id
      AND s.status = 'active'
      AND s.current_period_end > now()
  );
