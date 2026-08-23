export interface VendorProfileExtra {
  tier: string;
  tagline: string;
  followers: number;
  memberSince: number;
  responseTime: string;
  porsiTerselamatkan: number;
  co2eSavedKg: number;
}

export const DEFAULT_VENDOR_PROFILE: VendorProfileExtra = {
  tier: "UMKM Partner",
  tagline: "Mitra surplus makanan ReBites.",
  followers: 64,
  memberSince: 2024,
  responseTime: "± 10 menit",
  porsiTerselamatkan: 80,
  co2eSavedKg: 36,
};

export const VENDOR_PROFILES: Record<string, VendorProfileExtra> = {
  "warung-nusantara": {
    tier: "UMKM Partner · Level 3",
    tagline: "Masakan nusantara otentik, dimasak fresh setiap hari.",
    followers: 156,
    memberSince: 2023,
    responseTime: "± 5 menit",
    porsiTerselamatkan: 212,
    co2eSavedKg: 96,
  },
  "dapur-ibu-tini": {
    tier: "UMKM Partner · Level 2",
    tagline: "Kudapan pasar buatan sendiri, hangat dan hemat.",
    followers: 98,
    memberSince: 2024,
    responseTime: "± 8 menit",
    porsiTerselamatkan: 134,
    co2eSavedKg: 58,
  },
  "warkop-pak-iman": {
    tier: "UMKM Partner · Level 3",
    tagline: "Sarapan dan nongkrong favorit anak Bogor.",
    followers: 187,
    memberSince: 2022,
    responseTime: "± 4 menit",
    porsiTerselamatkan: 305,
    co2eSavedKg: 142,
  },
};

export function getVendorProfile(vendorId: string): VendorProfileExtra {
  return VENDOR_PROFILES[vendorId] ?? DEFAULT_VENDOR_PROFILE;
}
