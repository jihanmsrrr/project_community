// pages/api/berita/latest.ts
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

  try {
    const latestNews = await prisma.news.findMany({
      where: {
        // Hanya ambil berita yang sudah di-publish
        status: "published",
      },
      // Urutkan berdasarkan tanggal publikasi, yang terbaru di atas
      orderBy: {
        publishedAt: "desc",
      },
      // Ambil 4 berita teratas
      take: 4,
      select: {
        news_id: true,
        judul: true,
        abstrak: true,
        publishedAt: true,
        // Asumsi gambar_urls adalah JSON yang berisi array string URL
        gambar_urls: true,
      },
    });

    // Memproses data untuk memastikan formatnya benar
    const formattedNews = latestNews.map(news => {
      let imageUrl = "/placeholder.png"; // Gambar default jika tidak ada
      if (news.gambar_urls && Array.isArray(news.gambar_urls) && news.gambar_urls.length > 0) {
        // Ambil gambar pertama dari array
        imageUrl = news.gambar_urls[0] as string;
      }
      return {
        ...news,
        gambar: imageUrl,
      };
    });


    res.status(200).json(formattedNews);
  } catch (error) {
    console.error("API Error fetching latest news:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  } finally {
    await prisma.$disconnect();
  }
}
