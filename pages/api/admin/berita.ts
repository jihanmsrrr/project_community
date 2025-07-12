// pages/api/admin/berita.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// --- Fungsi Bantuan untuk Serialisasi BigInt ---
const jsonStringifyBigInt = (data: unknown) => {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // DIPERBARUI: Tambahkan logika untuk mengambil satu berita berdasarkan ID
        const { id } = req.query;

        if (id) {
          // JIKA ADA ID, AMBIL SATU BERITA LENGKAP
          const singleBerita = await prisma.news.findUnique({
            where: { news_id: BigInt(id as string) },
            // Sertakan semua field yang dibutuhkan untuk form edit
            include: {
              penulis: {
                select: {
                  nama_lengkap: true,
                },
              },
            },
          });

          if (!singleBerita) {
            return res.status(404).json({ error: "Berita tidak ditemukan." });
          }
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send(jsonStringifyBigInt(singleBerita));

        } else {
          // JIKA TIDAK ADA ID, AMBIL DAFTAR BERITA (RINGKASAN)
          const allBerita = await prisma.news.findMany({
            orderBy: {
              updatedAt: "desc",
            },
            // Hanya pilih data yang perlu untuk tabel agar cepat
            select: {
              news_id: true,
              judul: true,
              abstrak: true,
              kategori: true,
              updatedAt: true,
              status: true,
              penulis: {
                select: {
                  nama_lengkap: true,
                },
              },
            },
          });
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send(jsonStringifyBigInt(allBerita));
        }
      } catch (error) {
        console.error("API Error [GET /api/admin/berita]:", error);
        res.status(500).json({ error: "Gagal mengambil data berita." });
      }
      break;

    case "PATCH":
      try {
        // DIPERBARUI: Tambahkan field gambar dan isi_berita
        const { id, status, judul, abstrak, isi_berita, kategori, gambar } = req.body;

        if (!id) {
          return res.status(400).json({ error: "ID dibutuhkan." });
        }

        const dataToUpdate: Prisma.newsUpdateInput = {};
        if (status) dataToUpdate.status = status;
        if (judul) dataToUpdate.judul = judul;
        if (abstrak) dataToUpdate.abstrak = abstrak;
        if (isi_berita) dataToUpdate.isi_berita = isi_berita;
        if (kategori) dataToUpdate.kategori = kategori;
        if (gambar) dataToUpdate.gambar = gambar; // Tambahkan gambar
        
        if (status === 'published') {
          dataToUpdate.publishedAt = new Date();
        }

        const updatedBerita = await prisma.news.update({
          where: { news_id: BigInt(id) },
          data: dataToUpdate,
        });

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(jsonStringifyBigInt(updatedBerita));

      } catch (error) {
        console.error("API Error [PATCH /api/admin/berita]:", error);
        res.status(500).json({ error: "Gagal memperbarui berita." });
      }
      break;

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
