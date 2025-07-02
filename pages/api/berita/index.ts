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
            publishedAt: 'desc' // Urutkan dari yang terbaru (sesuai schema: publishedAt)
          }
        });
        res.status(200).json(allBerita);
      } catch (error) {
        console.error("Error mengambil data berita (GET /api/berita):", error);
        res.status(500).json({ message: 'Gagal mengambil data berita.', error });
      }
      break;

    case 'POST':
      // Membuat berita baru
      try {
        // Ambil data dari body request
        // Pastikan nama properti sesuai dengan schema (camelCase)
        const {
          judul,
          kategori,
          abstrak, // Ditambahkan, karena ada di schema
          isi_berita,
          penulisId, // Diubah dari penulis_id ke penulisId (sesuai schema)
          nama_penulis,
          kata_kunci, // Ditambahkan, sesuai schema (tipe Json)
          gambar_urls, // Ditambahkan, sesuai schema (tipe Json)
          status // Status bisa dikirim dari frontend, atau default 'menunggu_verifikasi'
        } = req.body;

        // Validasi data input yang mutlak wajib
        if (!judul || !isi_berita || !penulisId || !nama_penulis || !abstrak) {
          return res.status(400).json({ message: 'Judul, abstrak, isi berita, penulisId, dan nama_penulis wajib diisi.' });
        }

        const newBerita = await prisma.news.create({
          data: {
            news_id: Date.now(), // Atau gunakan UUID jika news_id adalah string, atau ganti sesuai kebutuhan
            judul,
            kategori,
            abstrak, // Tambahkan abstrak agar sesuai dengan schema
            isi_berita,
            penulisId: BigInt(penulisId), // Konversi ke BigInt karena di schema BigInt
            nama_penulis,
            // Jika kata_kunci atau gambar_urls tidak disediakan, defaultkan ke array kosong
            kata_kunci: kata_kunci || [], // Pastikan ini array (akan disimpan sebagai JSON)
            gambar_urls: gambar_urls || [], // Pastikan ini array (akan disimpan sebagai JSON)
            status: status || 'menunggu_verifikasi', // Gunakan status dari body, jika tidak ada, defaultkan
            savedAt: new Date(), // Set waktu disimpan
            createdAt: new Date(), // Set waktu dibuat (bisa dihandle @default(now()) di schema juga)
            // publishedAt akan diisi saat statusnya 'published', atau null
            publishedAt: status === 'published' ? new Date() : null,
          },
        });
        res.status(201).json({ message: 'Berita berhasil dibuat!', data: newBerita });
      } catch (error) {
        console.error("Error membuat berita baru (POST /api/berita):", error);
        res.status(500).json({ message: 'Gagal membuat berita baru.', error });
      }
      break;

    default:
      // Jika metode tidak diizinkan
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
