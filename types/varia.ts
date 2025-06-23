// /types/varia.ts

// Tipe untuk objek gambar
export type GambarFile = {
  originalFilename?: string;
  mimetype?: string;
  size: number;
  url: string;
};

// Tipe untuk komentar
export type Comment = {
  parentId: string;
  commentId: string; // ID unik untuk setiap komentar (sekarang commentId)
  userId: string; // ID user yang memberikan komentar
  text: string; // Isi komentar
  timestamp: number; // Waktu komentar dibuat (timestamp Unix)
};

// Tipe data mentah dari API/database
export type ArtikelBerita = {
  id: number;
  judul: string;
  kategori: string;
  kataKunci: string[];
  abstrak: string;
  isiBerita: string;
  status: 'published' | 'draft' | 'pending_review' | 'revision';
  gambarFiles: GambarFile[];
  savedAt: number;
  namaPenulis: string;
  penulisId: string;
  likes: number; // Tambahkan properti untuk jumlah like
  comments: Comment[]; // Tambahkan properti untuk array komentar
  saves: number; // Tambahkan properti untuk jumlah simpan
};

// Tipe data yang sudah diolah dan siap untuk ditampilkan di komponen UI
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
  comments: number | null; // Perhatikan: Ini bisa jadi jumlah komentar saja di UI card
}