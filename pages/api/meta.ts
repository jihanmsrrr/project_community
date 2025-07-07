// pages/api/berita/meta.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// --- PERBAIKAN: Gunakan pola inisialisasi PrismaClient yang aman untuk serverless ---
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {

  if (!global.prisma) {
 
    global.prisma = new PrismaClient();
  }
  
  prisma = global.prisma;
}
// --- AKHIR PERBAIKAN INISIALISASI PRISMACLIENT ---


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Tambahkan log awal di sini untuk memastikan handler terpanggil
  console.log("--- DEBUG: /api/berita/meta handler called ---");

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Debug log sebelum query database
    console.log("--- DEBUG: /api/berita/meta querying database ---");
    // Ambil SEMUA artikel, tetapi hanya kolom yang dibutuhkan
    const allArticles = await prisma.news.findMany({
      select: {
        kategori: true,
        nama_penulis: true,
      },
    });
    console.log(`--- DEBUG: /api/berita/meta found ${allArticles.length} articles ---`);


    // Proses di sisi server untuk mendapatkan nilai unik
    const categories = Array.from(new Set(allArticles.map(item => item.kategori).filter(Boolean) as string[]));
    const authors = Array.from(new Set(allArticles.map(item => item.nama_penulis).filter(Boolean) as string[]));
    
    // Debug log sebelum mengirim respons
    console.log("--- DEBUG: /api/berita/meta sending response ---");
    res.status(200).json({ categories, authors });
    
  } catch (error) {
    // Log error lebih detail
    console.error("API /api/berita/meta Error:", error instanceof Error ? error.message : error);
    res.status(500).json({ message: 'Gagal mengambil data meta dari server.' });
  }
}