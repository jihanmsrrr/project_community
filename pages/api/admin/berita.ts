// pages/api/admin/berita.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// --- Fungsi Bantuan untuk Serialisasi BigInt ---
// JSON.stringify tidak mendukung BigInt, jadi kita perlu mengubahnya menjadi string.
// DIPERBAIKI: Mengganti 'any' dengan 'unknown' untuk type safety yang lebih baik.
const jsonStringifyBigInt = (data: unknown) => {
  const a = JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
  return a;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    // MENGAMBIL SEMUA BERITA UNTUK ADMIN
    case "GET":
      try {
        const berita = await prisma.news.findMany({
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            penulis: {
              select: {
                nama_lengkap: true,
              },
            },
          },
        });
        
        // Kirim respons menggunakan fungsi bantuan
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(jsonStringifyBigInt(berita));

      } catch (error) {
        console.error("API Error [GET /api/admin/berita]:", error);
        res.status(500).json({ error: "Gagal mengambil data berita." });
      }
      break;

    // MEMPERBARUI BERITA (STATUS, JUDUL, DLL.)
    case "PATCH":
      try {
        const { id, status, judul, abstrak, isi_berita, kategori } = req.body;

        if (!id) {
          return res.status(400).json({ error: "ID dibutuhkan." });
        }

        const dataToUpdate: Prisma.newsUpdateInput = {};
        if (status) dataToUpdate.status = status;
        if (judul) dataToUpdate.judul = judul;
        if (abstrak) dataToUpdate.abstrak = abstrak;
        if (isi_berita) dataToUpdate.isi_berita = isi_berita;
        if (kategori) dataToUpdate.kategori = kategori;
        
        if (status === 'published') {
          dataToUpdate.publishedAt = new Date();
        }

        const updatedBerita = await prisma.news.update({
          where: { news_id: BigInt(id) },
          data: dataToUpdate,
        });

        // Kirim respons menggunakan fungsi bantuan
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(jsonStringifyBigInt(updatedBerita));

      } catch (error) {
        console.error("API Error [PATCH /api/admin/berita]:", error);
        res.status(500).json({ error: "Gagal memperbarui berita." });
      }
      break;

    // MENGHAPUS BERITA
    case "DELETE":
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: "ID dibutuhkan." });
        }
        await prisma.news.delete({
          where: { news_id: BigInt(id) },
        });
        res.status(204).end(); // No Content
      } catch (error) {
        console.error("API Error [DELETE /api/admin/berita]:", error);
        res.status(500).json({ error: "Gagal menghapus berita." });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
