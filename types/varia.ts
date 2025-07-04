// /types/varia.ts
import { Prisma } from '@prisma/client';

// --- PERBAIKAN: Menggunakan tipe yang di-generate oleh Prisma ---
// Ini adalah "sumber kebenaran" untuk data mentah dari API.
// Tipe ini akan selalu sinkron dengan schema database Anda.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const artikelWithPenulis = Prisma.validator<Prisma.newsDefaultArgs>()({
  include: { penulis: true }, // Menyertakan relasi penulis jika ada
});
export type ArtikelBerita = Prisma.newsGetPayload<typeof artikelWithPenulis>;
// --------------------------------------------------------------------


// Tipe data yang sudah diolah dan siap untuk ditampilkan di komponen UI.
// Tipe ini tetap diperlukan karena memiliki properti khusus untuk tampilan.
export interface NewsCardItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: Date;
  displayDate: string;
  author: string;
  authorImageUrl: string;
  link: string;
  imageUrl: string;
  // Properti untuk styling dinamis berdasarkan kategori
  categoryColor: string;
  categoryBgColor: string;
  categoryHoverColor: string;
  placeholderTextColor: string;
  // Data tambahan (bisa null jika tidak ada)
  views: number | null;
  comments: number | null;
}
