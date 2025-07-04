// pages/api/berita/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();
export const config = { api: { bodyParser: false } };
const uploadDir = path.join(process.cwd(), "/public/files/berita");

const jsonReplacer = (key: string, value: unknown) => typeof value === 'bigint' ? value.toString() : value;

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const form = formidable({ uploadDir, keepExtensions: true, multiples: true, maxFileSize: 5 * 1024 * 1024 });
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id) || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ message: "ID berita tidak valid." });
  }
  const newsId = BigInt(id);

  const session = await getServerSession(req, res, authOptions);

  switch (req.method) {
    case 'GET':
      try {
        const berita = await prisma.news.findUnique({ where: { news_id: newsId } });
        if (!berita) return res.status(404).json({ message: 'Berita tidak ditemukan.' });
        return res.status(200).setHeader('Content-Type', 'application/json').send(JSON.stringify(berita, jsonReplacer));
      } catch (error) {
        return res.status(500).json({ message: 'Gagal mengambil data berita.' });
      }

    case 'PUT':
      if (!session?.user?.id) return res.status(401).json({ message: "Akses ditolak." });
      
      try {
        const existingNews = await prisma.news.findUnique({ where: { news_id: newsId } });
        if (!existingNews) return res.status(404).json({ message: "Berita tidak ditemukan." });

        if (session.user.role !== 'admin' && existingNews.penulisId.toString() !== session.user.id) {
            return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengedit berita ini." });
        }

        const { fields, files } = await parseForm(req);
        const { judul, abstrak, kategori, kata_kunci, isi_berita, status } = fields;

        const dataToUpdate: Prisma.newsUpdateInput = {
            judul: Array.isArray(judul) ? judul[0] : judul,
            abstrak: Array.isArray(abstrak) ? abstrak[0] : abstrak,
            kategori: Array.isArray(kategori) ? kategori[0] : kategori,
            kata_kunci: JSON.parse(Array.isArray(kata_kunci) ? kata_kunci[0] : kata_kunci || '[]'),
            isi_berita: Array.isArray(isi_berita) ? isi_berita[0] : isi_berita,
            status: Array.isArray(status) ? status[0] : status,
            updatedAt: new Date(),
            publishedAt: (Array.isArray(status) && status[0] === 'published') ? new Date() : existingNews.publishedAt,
        };

        const gambarFiles = files.gambar as formidable.File[] | formidable.File | undefined;
        // --- PERBAIKAN LOGIKA GAMBAR ---
        // Hanya proses gambar jika ada file baru yang diunggah
        if (gambarFiles && ( (Array.isArray(gambarFiles) && gambarFiles.length > 0) || (!Array.isArray(gambarFiles) && gambarFiles.size > 0) ) ) {
            // Hapus gambar lama jika ada
            const oldImages = existingNews.gambar_urls as { url: string }[] | null;
            if (oldImages) {
                oldImages.forEach(img => {
                    const oldPath = path.join(process.cwd(), 'public', img.url);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                });
            }
            // Tambahkan gambar baru
            const fileArray = Array.isArray(gambarFiles) ? gambarFiles : [gambarFiles];
            dataToUpdate.gambar_urls = fileArray.map(file => ({ url: `/files/berita/${file.newFilename}` }));
        }

        const updatedBerita = await prisma.news.update({
            where: { news_id: newsId },
            data: dataToUpdate,
        });

        return res.status(200).setHeader('Content-Type', 'application/json').send(JSON.stringify(updatedBerita, jsonReplacer));
      } catch (error) {
        console.error("API PUT Error:", error);
        return res.status(500).json({ message: 'Gagal mengupdate berita.', error: (error as Error).message });
      }

    case 'DELETE':
        if (!session?.user?.id || session.user.role !== 'admin') {
            return res.status(403).json({ message: "Hanya admin yang bisa menghapus berita." });
        }
        try {
            const newsToDelete = await prisma.news.findUnique({ where: { news_id: newsId } });
            if(newsToDelete?.gambar_urls){
                const oldImages = newsToDelete.gambar_urls as { url: string }[] | null;
                if (oldImages) {
                    oldImages.forEach(img => {
                        const oldPath = path.join(process.cwd(), 'public', img.url);
                        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                    });
                }
            }
            // Hapus semua relasi sebelum menghapus berita
            await prisma.likes.deleteMany({ where: { article_id: newsId } });
            await prisma.comments.deleteMany({ where: { news_id: newsId } });
            await prisma.bookmarks.deleteMany({ where: { article_id: newsId } });

            await prisma.news.delete({ where: { news_id: newsId } });
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ message: 'Gagal menghapus berita.', error: (error as Error).message });
        }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
