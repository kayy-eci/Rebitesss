import type { Metadata } from 'next';
import { UserProfile } from './components/user-profile';

export const metadata: Metadata = {
  title: 'Profil - ReBites',
  description:
    'Kelola profil, alamat pengiriman, langganan, dan riwayat pesanan Anda di ReBites.',
};

export default function ProfilePage() {
  return <UserProfile />;
}
