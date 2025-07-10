// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const query = req.query.q as string;

  if (!query || query.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Query pencarian harus memiliki minimal 3 karakter." });
  }

  try {
    // Menjalankan semua query pencarian secara paralel untuk efisiensi
    const [newsResults, userResults, materialResults] = await Promise.all([
      // Mencari di tabel Berita (news)
      prisma.news.findMany({
        where: {
          OR: [
            { judul: { contains: query } },
            { abstrak: { contains: query } },
            { isi_berita: { contains: query } },
          ],
        },
        select: {
          news_id: true,
          judul: true,
          abstrak: true,
          publishedAt: true,
          kategori: true,
        },
        take: 5, // Batasi hasil untuk performa
      }),
      // Mencari di tabel Pengguna (users)
      prisma.users.findMany({
        where: {
          OR: [
            { nama_lengkap: { contains: query } },
            { jabatan_struktural: { contains: query } },
          ],
        },
        select: {
          user_id: true,
          nama_lengkap: true,
          jabatan_struktural: true,
          unit_kerja_eselon2: true,
          foto_url: true,
        },
        take: 5,
      }),
      // Mencari di tabel Ruang Baca (reading_materials)
      prisma.reading_materials.findMany({
        where: {
          OR: [
            { judul: { contains: query } },
            { deskripsi: { contains: query } },
            { kategori: { contains: query } },
          ],
        },
        select: {
          material_id: true,
          judul: true,
          deskripsi: true,
          kategori: true,
          bacaUrl: true,
        },
        take: 5,
      }),
    ]);

    res.status(200).json({
      berita: newsResults,
      pegawai: userResults,
      ruangBaca: materialResults,
    });
  } catch (error) {
    console.error("API Search Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  } finally {
    await prisma.$disconnect();
  }
}
