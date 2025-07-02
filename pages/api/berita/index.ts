import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Menggunakan switch untuk menangani metode HTTP yang berbeda
  switch (req.method) {
    case 'GET':
      // Mengambil semua data berita
      try {
        const allBerita = await prisma.news.findMany({
          where: {
            status: 'published' // Hanya tampilkan berita yang sudah tayang
          },
          orderBy: {
            published_at: 'desc' // Urutkan dari yang terbaru
          }
        });
        res.status(200).json(allBerita);
      } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data berita.', error });
      }
      break;

    case 'POST':
      // Membuat berita baru
      try {
        // Ambil data dari body request
        const { judul, kategori, abstrak, isi_berita, penulis_id, nama_penulis } = req.body;

        // Validasi data input
        if (!judul || !isi_berita || !penulis_id) {
          return res.status(400).json({ message: 'Judul, isi berita, dan penulis_id wajib diisi.' });
        }

        const newBerita = await prisma.news.create({
          data: {
            judul,
            kategori,
            abstrak,
            isi_berita,
            penulis_id,
            nama_penulis,
            status: 'menunggu_verifikasi', // Status default saat dibuat
            // Kolom gambar dan lampiran akan di-handle terpisah
          },
        });
        res.status(201).json({ message: 'Berita berhasil dibuat!', data: newBerita });
      } catch (error) {
        res.status(500).json({ message: 'Gagal membuat berita baru.', error });
      }
      break;

    default:
      // Jika metode tidak diizinkan
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}