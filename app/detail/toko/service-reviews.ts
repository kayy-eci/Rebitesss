export interface ServiceReview {
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

const pexelsAvatar = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop`;

export const SERVICE_REVIEWS: Record<string, ServiceReview[]> = {
  'warung-nusantara': [
    {
      name: 'Andi Pratama',
      avatar: pexelsAvatar(220453),
      rating: 5,
      comment:
        'Pelayanannya ramah dan proses pengambilan makanan cepat, tidak perlu antre lama.',
      timeAgo: '2 hari lalu',
    },
    {
      name: 'Siti Rahma',
      avatar: pexelsAvatar(774909),
      rating: 4,
      comment:
        'Staff cukup ramah dan pesanannya sudah disiapkan dengan baik sesuai jadwal.',
      timeAgo: '5 hari lalu',
    },
    {
      name: 'Budi Santoso',
      avatar: pexelsAvatar(1222271),
      rating: 5,
      comment:
        'Packing rapi, makanan masih hangat waktu diambil. Komunikasinya juga enak.',
      timeAgo: '1 minggu lalu',
    },
    {
      name: 'Dewi Lestari',
      avatar: pexelsAvatar(415829),
      rating: 4,
      comment:
        'Admin responsif membalas chat, cuma waktu tunggu agak lama saat jam sibuk.',
      timeAgo: '1 minggu lalu',
    },
    {
      name: 'Rizky Maulana',
      avatar: pexelsAvatar(614810),
      rating: 3,
      comment:
        'Rasa konsisten dan staff membantu, tapi tanda antrean pengambilan kurang jelas.',
      timeAgo: '2 minggu lalu',
    },
  ],
  'dapur-ibu-tini': [
    {
      name: 'Maya Anggraini',
      avatar: pexelsAvatar(1130626),
      rating: 5,
      comment:
        'Bu Tini sangat ramah, pesanan selalu sudah siap tepat jadwal pengambilan.',
      timeAgo: '1 hari lalu',
    },
    {
      name: 'Fajar Nugroho',
      avatar: pexelsAvatar(2379004),
      rating: 4,
      comment:
        'Proses pengambilan cepat, kemasan dibungkus rapi dan aman dibawa jauh.',
      timeAgo: '3 hari lalu',
    },
    {
      name: 'Intan Permata',
      avatar: pexelsAvatar(1239291),
      rating: 5,
      comment:
        'Staff responsif banget membalas chat, pengalaman ambil pesanan lancar.',
      timeAgo: '4 hari lalu',
    },
    {
      name: 'Hendra Wijaya',
      avatar: pexelsAvatar(1043471),
      rating: 3,
      comment:
        'Masakannya enak, hanya saja saya sempat menunggu agak lama saat jam makan siang.',
      timeAgo: '1 minggu lalu',
    },
    {
      name: 'Ratna Sari',
      avatar: pexelsAvatar(733872),
      rating: 4,
      comment:
        'Pelayanan hangat dan sabar menjawab pertanyaan soal menu surplus hari itu.',
      timeAgo: '2 minggu lalu',
    },
  ],
  'warkop-pak-iman': [
    {
      name: 'Dimas Prasetyo',
      avatar: pexelsAvatar(91227),
      rating: 5,
      comment:
        'Pak Iman ramah, pesanan kopi dan snack selalu siap sebelum jadwal ambil.',
      timeAgo: '1 hari lalu',
    },
    {
      name: 'Nadia Putri',
      avatar: pexelsAvatar(762020),
      rating: 4,
      comment:
        'Staff gerak cepat meski lagi ramai, packing minuman aman tidak tumpah.',
      timeAgo: '4 hari lalu',
    },
    {
      name: 'Yusuf Hidayat',
      avatar: pexelsAvatar(1681010),
      rating: 5,
      comment:
        'Komunikasinya baik sekali, salah pesan langsung diganti tanpa ribet.',
      timeAgo: '6 hari lalu',
    },
    {
      name: 'Lina Marlina',
      avatar: pexelsAvatar(1858175),
      rating: 3,
      comment:
        'Menu standarnya enak, tapi antreannya lumayan panjang kalau pagi hari.',
      timeAgo: '1 minggu lalu',
    },
    {
      name: 'Agus Setiawan',
      avatar: pexelsAvatar(1516680),
      rating: 4,
      comment:
        'Titik pengambilan jelas dan staff membantu carikan pesanan dengan cepat.',
      timeAgo: '2 minggu lalu',
    },
  ],
};
