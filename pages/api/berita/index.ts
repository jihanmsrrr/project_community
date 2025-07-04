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
const uploadDir = path.join(process.cwd(), "/public/files/berita");

const jsonReplacer = (key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

const parseForm = (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5 * 1024 * 1024,
    });
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
  switch (req.method) {
    case "GET":
      try {
        const {
          search,
          kategori,
          penulis,
          urutkan,
          tanggalMulai,
          tanggalSelesai,
        } = req.query;
        const where: Prisma.newsWhereInput = { status: "published" };

        if (search && typeof search === "string") {
          // PERBAIKAN: Menghapus 'mode' untuk kompatibilitas. Pencarian akan menjadi case-sensitive.
          // Untuk pencarian case-insensitive, pastikan database Anda (misal: PostgreSQL) mendukungnya
          // dan konfigurasi Prisma Anda sudah benar.
          where.OR = [
            { judul: { contains: search } },
            { abstrak: { contains: search } },
          ];
        }
        if (kategori && typeof kategori === "string") where.kategori = kategori;
        if (penulis && typeof penulis === "string")
          where.nama_penulis = penulis;

        if (tanggalMulai && typeof tanggalMulai === "string") {
          where.savedAt = {
            ...(where.savedAt as Prisma.DateTimeFilter),
            gte: new Date(tanggalMulai),
          };
        }
        if (tanggalSelesai && typeof tanggalSelesai === "string") {
          where.savedAt = {
            ...(where.savedAt as Prisma.DateTimeFilter),
            lte: new Date(tanggalSelesai),
          };
        }

        const orderBy: Prisma.newsOrderByWithRelationInput =
          urutkan === "judul" ? { judul: "asc" } : { savedAt: "desc" };

        const articles = await prisma.news.findMany({
          where,
          orderBy,
          include: { penulis: { select: { nama_lengkap: true } } },
        });
        return res
          .status(200)
          .setHeader("Content-Type", "application/json")
          .send(JSON.stringify(articles, jsonReplacer));
      } catch (error) {
        console.error("API GET Error:", error);
        return res
          .status(500)
          .json({ message: "Gagal mengambil data berita." });
      }

    case "POST":
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user?.id) {
        return res
          .status(401)
          .json({ message: "Akses ditolak. Anda harus login." });
      }

      try {
        const { fields, files } = await parseForm(req);
        const { judul, abstrak, kategori, kata_kunci, isi_berita, status } =
          fields;

        if (!judul || !abstrak || !kategori || !isi_berita) {
          return res
            .status(400)
            .json({
              message: "Judul, Abstrak, Kategori, dan Isi Berita wajib diisi.",
            });
        }

        const gambarFiles = files.gambar as
          | formidable.File[]
          | formidable.File
          | undefined;
        let gambarUrls: Prisma.JsonValue = [];

        if (gambarFiles) {
          const fileArray = Array.isArray(gambarFiles)
            ? gambarFiles
            : [gambarFiles];
          gambarUrls = fileArray.map((file) => ({
            url: `/files/berita/${file.newFilename}`,
          }));
        }

        // PERBAIKAN: Menambahkan news_id secara manual karena skema Anda belum auto-increment.
        // SANGAT DISARANKAN untuk mengubah skema menjadi `@default(autoincrement())`
        const newBerita = await prisma.news.create({
          data: {
            news_id: BigInt(Date.now()), // ID sementara, berisiko duplikat
            judul: Array.isArray(judul) ? judul[0] : judul,
            abstrak: Array.isArray(abstrak) ? abstrak[0] : abstrak,
            kategori: Array.isArray(kategori) ? kategori[0] : kategori,
            kata_kunci: JSON.parse(
              Array.isArray(kata_kunci) ? kata_kunci[0] : kata_kunci || "[]"
            ),
            isi_berita: Array.isArray(isi_berita) ? isi_berita[0] : isi_berita,
            status: Array.isArray(status) ? status[0] : status || "draft",
            nama_penulis: session.user.name || "Admin",
            penulisId: BigInt(session.user.id),
            gambar_urls: gambarUrls,
            savedAt: new Date(),
            publishedAt:
              (Array.isArray(status) ? status[0] : status) === "published"
                ? new Date()
                : null,
          },
        });

        return res
          .status(201)
          .setHeader("Content-Type", "application/json")
          .send(JSON.stringify(newBerita, jsonReplacer));
      } catch (error) {
        console.error("API POST Error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak diketahui.";
        return res
          .status(500)
          .json({ message: "Gagal membuat berita baru.", error: errorMessage });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
