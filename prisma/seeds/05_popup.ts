import { Prisma } from '@prisma/client';

export async function seedPopup(prisma: Prisma.TransactionClient) {
  const pengumumanData = [
    {
      judul: "Informasi Kegiatan Biroren",
      gambarUrl: "/popup1.jpg",
      isiPengumuman: "Pengumuman terkait kegiatan dan informasi terbaru dari Biro Perencanaan.",
      targetUrl: "/biroren", // Contoh tautan internal
      tanggalMulai: new Date('2025-07-01'),
      tanggalBerakhir: new Date('2025-07-31'),
      aktif: true,
    },
    {
      judul: "Panduan Sinkronisasi Email di iPhone",
      gambarUrl: "/popup2.jpg",
      isiPengumuman: "Pelajari langkah-langkah mudah untuk melakukan sinkronisasi email di perangkat iPhone Anda.",
      targetUrl: "https://support.apple.com/id-id/HT201320", // Contoh tautan eksternal
      tanggalMulai: new Date('2025-07-05'),
      tanggalBerakhir: new Date('2025-08-15'),
      aktif: true,
    },
    {
      judul: "Tips Koneksi Wifi Aman",
      gambarUrl: "/popup3.jpg",
      isiPengumuman: "Amankan koneksi Wifi Anda dengan mengikuti tips dan trik berikut.",
      targetUrl: "/tips-wifi-aman", // Contoh tautan internal
      tanggalMulai: new Date('2025-07-10'),
      tanggalBerakhir: new Date('2025-07-25'),
      aktif: false,
    },
    {
      judul: "Waspada Terhadap Phishing Email",
      gambarUrl: "/popup4.jpg",
      isiPengumuman: "Kenali ciri-ciri email *phishing* dan cara menghindarinya agar data Anda tetap aman.",
      targetUrl: "/waspada-phishing", // Contoh tautan internal
      tanggalMulai: new Date('2025-07-15'),
      tanggalBerakhir: new Date('2025-08-30'),
      aktif: true,
    },
    {
      judul: "Informasi Terkait Email Terblokir",
      gambarUrl: "/popup5.jpg",
      isiPengumuman: "Panduan dan solusi jika Anda mengalami masalah email terblokir.",
      targetUrl: "/email-terblokir", // Contoh tautan internal
      tanggalMulai: new Date('2025-07-20'),
      tanggalBerakhir: new Date('2025-08-05'),
      aktif: false,
    },
    {
      judul: "Sosialisasi Manajemen Perubahan Organisasi",
      gambarUrl: "/popup6.jpg",
      isiPengumuman: "Informasi dan materi terkait sosialisasi manajemen perubahan organisasi.",
      targetUrl: "/manajemen-perubahan", // Contoh tautan internal
      tanggalMulai: new Date('2025-07-25'),
      tanggalBerakhir: new Date('2025-09-30'),
      aktif: true,
    },
  ];

  for (const pengumuman of pengumumanData) {
    await prisma.pengumuman.create({
      data: pengumuman,
    });
  }

  console.log('Seeding data pengumuman selesai');
}