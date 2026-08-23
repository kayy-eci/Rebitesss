/**
 * Sumber identitas user — SATU-SATUNYA tempat identitas demo didefinisikan.
 *
 * Saat ini ReBites masih demo, jadi tidak ada login yang diwajibkan:
 * semua order dimiliki oleh satu identitas `demo-user`.
 *
 * Ketika authentication asli sudah tersedia, cukup ganti isi fungsi
 * `getCurrentUser()` di file ini (mis. baca sesi Supabase) — seluruh
 * halaman Pesanan Saya, checkout, dan storage tidak perlu diubah.
 */

export const DEMO_USER_ID = 'demo-user';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
}

const DEMO_USER: CurrentUser = {
  id: DEMO_USER_ID,
  fullName: 'Pengguna Demo',
  email: 'demo@rebites.id',
};

/** TODO(auth): ganti dengan pembacaan sesi autentikasi asli. */
export function getCurrentUser(): CurrentUser {
  return DEMO_USER;
}

export function getCurrentUserId(): string {
  return getCurrentUser().id;
}
