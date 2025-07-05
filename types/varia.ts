// /types/varia.ts
import { Prisma } from '@prisma/client'; // Cukup impor Prisma saja

// --- Menggunakan tipe yang di-generate oleh Prisma dengan relasi penulis ---
// Tipe ArtikelBerita sekarang mencakup semua kolom 'news' + objek 'penulis' (dari tabel 'users')
export type ArtikelBerita = Prisma.newsGetPayload<{ // Menggunakan newsGetPayload
  include: { penulis: true }; // Menyertakan relasi penulis
}>;

// --- Tipe data yang sudah diolah dan siap untuk ditampilkan di komponen UI. ---
// Tipe ini tetap diperlukan karena memiliki properti khusus untuk tampilan,
// yang mungkin berbeda dari struktur data mentah dari database.
export interface NewsCardItem {
  id: string; // news_id dalam bentuk string (untuk URL atau komponen UI yang mengharapkan string)
  title: string; // judul
  excerpt: string; // abstrak
  category: string; // kategori
  date: Date; // savedAt sebagai objek Date
  displayDate: string; // Tanggal yang sudah diformat untuk tampilan
  author: string; // nama_penulis, atau nama_lengkap dari relasi penulis
  authorImageUrl: string; // foto_url penulis, jika ada
  link: string; // URL slug untuk artikel
  imageUrl: string; // salah satu gambar_urls
  // Properti untuk styling dinamis berdasarkan kategori
  categoryColor: string;
  categoryBgColor: string;
  categoryHoverColor: string;
  placeholderTextColor: string;
  // Data tambahan (bisa null jika tidak ada di sumber data Anda atau dihitung)
  views: number | null; // hits jika ada di News (atau kolom terpisah)
  comments: number | null; // jumlah komentar, dihitung di sisi server
}

// --- Tipe data untuk Komentar, disesuaikan dengan skema Prisma 'comments' ---
export type Comment = Prisma.commentsGetPayload<{ // Menggunakan commentsGetPayload
  include: {
    pengguna: true; // Menyertakan relasi pengguna yang berkomentar
    replies: true;  // Menyertakan balasan (jika ada relasi rekursif di schema.prisma)
  }
}>;

// --- Kamu bisa menambahkan tipe lain di sini sesuai kebutuhan, misalnya untuk likes atau bookmarks ---
// export type Likes = Prisma.likesGetPayload<{
//   include: { /* relasi yang ingin disertakan */ }
// }>;

// export type Bookmark = Prisma.bookmarksGetPayload<{
//   include: { /* relasi yang ingin disertakan */ }
// }>;