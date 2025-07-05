// pages/api/berita/related.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

const prisma = new PrismaClient(); // Inisialisasi PrismaClient

export default async function handler( // Tambahkan 'async' di sini
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Hanya izinkan metode GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  // 2. Ambil parameter dari query URL
  const { currentId, category } = req.query;

  // Validasi input
  if (!currentId || !category || typeof currentId !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ message: 'Parameter "currentId" dan "category" diperlukan.' });
  }

  try {
    // PERBAIKAN: Konversi currentId ke BigInt
    // currentId dari query selalu string. Kita ubah ke BigInt.
    // Pastikan ID di URL juga dikirim sebagai string yang bisa di-parse ke BigInt.
    const numericCurrentId = BigInt(currentId); 

    // 3. Logika Inti: Query Database dengan Prisma
    const related = await prisma.news.findMany({ // Gunakan prisma.news.findMany
      where: {
        // Kondisi 1: Kategorinya harus sama
        kategori: category, 
        // Kondisi 2: ID-nya tidak boleh sama dengan artikel yang sedang dibuka
        // Gunakan not (NOT) untuk memastikan news_id tidak sama dengan currentId
        NOT: {
          news_id: numericCurrentId,
        },
      },
      // Urutkan berdasarkan tanggal publikasi terbaru (atau createdAt jika tidak ada publishedAt)
      orderBy: {
        publishedAt: 'desc', // Atau 'createdAt: 'desc'' jika publishedAt bisa null
      },
      take: 3, // Ambil 3 artikel terkait saja
      // PERHATIAN: Jika kamu ingin menyertakan data penulis atau relasi lain,
      // tambahkan di sini:
      // include: {
      //   penulis: true, // Untuk menyertakan data penulis
      // }
    });

    // 4. Kirim hasil sebagai JSON
    // BigInt tidak bisa langsung di-serialize ke JSON. Kita perlu mengubahnya ke string.
    // Cara paling mudah adalah dengan middleware atau stringify dengan replacer.
    const serializedRelated = JSON.parse(JSON.stringify(related, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value // Ubah BigInt ke string
    ));

    return res.status(200).json(serializedRelated);

  } catch (error) {
    console.error("API /related Error:", error);
    // Pastikan PrismaClient terputus jika ada error
    await prisma.$disconnect(); 
    return res.status(500).json({ message: 'Gagal mengambil data berita terkait.' });
  } finally {
    // Pastikan PrismaClient terputus setelah setiap request
    await prisma.$disconnect();
  }
}