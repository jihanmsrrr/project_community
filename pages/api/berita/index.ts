// pages/api/berita/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();
export const config = { api: { bodyParser: false } };
const uploadDir = path.join(process.cwd(), "/public/uploads/berita"); // Path untuk menyimpan gambar

const jsonReplacer = (key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

// Helper untuk memastikan direktori ada
const ensureDirExists = () => {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
};

// Helper untuk mengambil nilai pertama jika berupa array
const getFirstValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
};
// --- HANDLER UTAMA ---
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const { search, kategori, penulis, urutkan, tanggalMulai, tanggalSelesai } = req.query;
        const where: Prisma.newsWhereInput = { status: "published" };

        if (search && typeof search === "string") {
          where.OR = [
            { judul: { contains: search } },
            { abstrak: { contains: search } },
          ];
        }
        if (kategori && typeof kategori === "string") where.kategori = kategori;
        if (penulis && typeof penulis === "string") where.nama_penulis = penulis;
      if (tanggalMulai && typeof tanggalMulai === 'string') {
        where.savedAt = { ...where.savedAt as Prisma.DateTimeFilter, gte: new Date(tanggalMulai) };
      }
      if (tanggalSelesai && typeof tanggalSelesai === 'string') {
        where.savedAt = { ...where.savedAt as Prisma.DateTimeFilter, lte: new Date(tanggalSelesai) };
      }
      
      const orderBy: Prisma.newsOrderByWithRelationInput = urutkan === 'judul' ? { judul: 'asc' } : { savedAt: 'desc' };
const articles = await prisma.news.findMany({
          where,
          orderBy,
          include: { penulis: { select: { nama_lengkap: true } } },
        });
return res
          .status(200)
          .setHeader('Content-Type', 'application/json')
          .send(JSON.stringify(articles, jsonReplacer));

      } catch (error) {
        console.error("API GET Error:", error);
        return res.status(500).json({ message: "Gagal mengambil data berita." });
      }
  }

  // === METHOD POST: MEMBUAT BERITA BARU ===
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.id) {
      return res.status(401).json({ message: "Akses ditolak. Anda harus login." });
    }

    ensureDirExists();
    const form = formidable({ uploadDir, keepExtensions: true, multiples: true, maxFileSize: 5 * 1024 * 1024 });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ message: "Gagal memproses form data" });

      try {
        const judul = getFirstValue(fields.judul);
        const abstrak = getFirstValue(fields.abstrak);
        const kategori = getFirstValue(fields.kategori);
        const isi_berita = getFirstValue(fields.isi_berita);
        const status = getFirstValue(fields.status) || "draft";
        
        if (!judul || !kategori || !isi_berita) {
          return res.status(400).json({ message: "Judul, Kategori, dan Isi Berita wajib diisi." });
        }
        
        const kata_kunci = JSON.parse(getFirstValue(fields.kata_kunci) || "[]");
        
        let gambar_urls: Prisma.JsonValue = [];
        const gambarFiles = files.gambar as formidable.File | formidable.File[] | undefined;
        if (gambarFiles) {
          const fileArray = Array.isArray(gambarFiles) ? gambarFiles : [gambarFiles];
          gambar_urls = fileArray.map(file => ({ url: `/uploads/berita/${path.basename(file.filepath)}` }));
        }

        // PERBAIKAN: Biarkan database menangani 'news_id' dengan AUTO_INCREMENT
        const newBerita = await prisma.news.create({
          data: {
            judul, abstrak, kategori, kata_kunci, isi_berita, status, gambar_urls,
            nama_penulis: session.user.name || "Tanpa Nama",
            penulisId: BigInt(session.user.id),
            savedAt: new Date(),
            publishedAt: status === "published" ? new Date() : null,
          }
        });

        return res.status(201).json(newBerita);
      } catch (error) {
        console.error("API POST Error:", error);
        return res.status(500).json({ message: "Gagal membuat berita baru.", error: (error as Error).message });
      }
    });
    return;
  }

  // Jika method tidak diizinkan
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}