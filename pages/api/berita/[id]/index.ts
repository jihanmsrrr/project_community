import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ambil ID dari URL dan konversi ke BigInt
  const { id } = req.query;
  const newsId = BigInt(id as string);

  switch (req.method) {
    case 'GET':
      // Mengambil detail satu berita
      try {
        const berita = await prisma.news.findUnique({
          where: { news_id: newsId },
        });
        if (berita) {
          res.status(200).json(berita);
        } else {
          res.status(404).json({ message: 'Berita tidak ditemukan.' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data berita.', error });
      }
      break;

    case 'PUT':
      // Meng-update satu berita (gantungan PATCH)
      try {
        const { judul, kategori, isi_berita, status } = req.body;
        const updatedBerita = await prisma.news.update({
          where: { news_id: newsId },
          data: {
            judul,
            kategori,
            isi_berita,
            status,
            updatedAt: new Date(), // Set waktu update
          },
        });
        res.status(200).json({ message: 'Berita berhasil diupdate!', data: updatedBerita });
      } catch (error) {
        res.status(500).json({ message: 'Gagal mengupdate berita.', error });
      }
      break;

    case 'DELETE':
      // Menghapus satu berita
      try {
        await prisma.news.delete({
          where: { news_id: newsId },
        });
        res.status(200).json({ message: 'Berita berhasil dihapus.' });
      } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus berita.', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}