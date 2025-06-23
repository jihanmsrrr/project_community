// pages/api/berita/related.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { readBeritaFile } from './_helpers'; // Impor fungsi helper kita

export default function handler(
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
    const allBerita = readBeritaFile();
    const numericCurrentId = Number(currentId);

    // 3. Logika Inti: Filter & Batasi Hasil
    const related = allBerita
      .filter(artikel => 
        // Kondisi 1: Kategorinya harus sama
        artikel.kategori === category && 
        // Kondisi 2: ID-nya tidak boleh sama dengan artikel yang sedang dibuka
        artikel.id !== numericCurrentId
      )
      .slice(0, 3); // Ambil 3 artikel terkait saja

    // 4. Kirim hasil sebagai JSON
    return res.status(200).json(related);

  } catch (error) {
    console.error("API /related Error:", error);
    return res.status(500).json({ message: 'Gagal mengambil data berita terkait.' });
  }
}