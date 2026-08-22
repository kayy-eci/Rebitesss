# Plan: Fix Search Bar Makanan (Search → Dropdown → Pop-up Detail Produk)

## Status
Menunggu eksekusi. Mode saat ini read-only (`edit` di-deny untuk file aplikasi).

## Konteks
- Next.js App Router + TS + Tailwind + framer-motion.
- Search bar: `app/components/SearchFilterBar.tsx`, dipakai `UrgentDealsSection` (landing `/` + home `/homePage`), `ExploreSection` (unused), dan `/cari`.
- Masalah: submit → `router.push("/cari?...")` = navigasi halaman.
- Data asli: `foodItems` di `lib/data.ts` (id cocok dengan `PRODUCTS` di `app/detail/product/data.ts`).
- Modal sudah ada & ter-wire: `ProductDetailModal` + `getProductById()` via `onViewDetail(id)` di kedua page.

## Perubahan

### 1. `app/components/SearchFilterBar.tsx`
- Props baru (opt-in, default off — `/cari` tidak berubah): `showInlineResults?: boolean`, `onSelectResult?: (id: string) => void`.
- State internal: `isDropdownOpen`; hasil via `useMemo`: filter `foodItems` by nama + vendorName (case-insensitive), filter/sort mengikuti `activeFilter` (logika sama dengan `/cari`).
- Bungkus input pill dalam `<div className="relative flex-1">`; dropdown absolute top-full z-50 + overlay fixed inset-0 z-40 (pola yang sama dengan dropdown lokasi) → klik luar menutup tanpa hapus keyword; Esc menutup.
- Dropdown row: SmartImage 48px, nama + nama toko dengan highlight `<mark>` substring match, stockLabel · jarak, harga diskon + coret. Max-h 340px scroll.
- Query kosong → dropdown tidak render. Hasil kosong → "Makanan tidak ditemukan" (+ SearchX icon).
- Klik hasil → tutup dropdown + `onSelectResult(item.id)` (buka modal, tanpa navigasi).
- Tombol X custom ("Hapus pencarian") muncul saat inline mode & query ada; sembunyikan native webkit cancel `[&::-webkit-search-cancel-button]:hidden`; clear → reset query + tutup dropdown + fokus balik ke input.
- onFocus (query ada) → buka lagi dropdown; onChange kosong → tutup otomatis.
- Enter/submit: preventDefault + pastikan dropdown tetap terbuka; TIDAK navigasi.

### 2. `app/components/UrgentDealsSection.tsx`
- Hapus `useRouter` + `handleSearchSubmit` (router.push `/cari`).
- Pass ke SearchFilterBar: `showInlineResults`, `onSelectResult={onViewDetail}`, `onSearchSubmit={() => undefined}`.

### 3. `app/components/ExploreSection.tsx`
- Sama seperti #2; tambah prop opsional `onViewDetail?: (id: string) => void`.

### Tidak diubah
`app/page.tsx`, `app/home/page.tsx`, `/cari`, route manapun, layout/desain, FoodCard, data.

## Verifikasi
1. `npm run typecheck` (tsc --noEmit)
2. `npm run lint`
3. Manual: ketik "ayam" di Home → dropdown muncul (Geprek/Sate/Mie Ayam, highlight) → klik produk → modal terbuka, URL tetap → tutup → kembali normal. X/clear reset. Klik luar tutup dropdown. Keyword aneh → "Makanan tidak ditemukan". Enter tidak pindah halaman.
