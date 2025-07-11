// pages/api/dashboard/main.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const [
      latestNews,
      recentComments,
      topContributors,
      topCommentators,
      onlineUsers,
      newsCount,
      userCount,
      documentCount,
    ] = await Promise.all([
      prisma.news.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 8,
        select: {
          news_id: true,
          judul: true,
          abstrak: true,
          publishedAt: true,
          gambar_urls: true,
          penulis: { select: { nama_lengkap: true } },
          _count: { select: { likes: true, komentar: true } },
        },
      }),
      prisma.comments.findMany({
        orderBy: { tanggal_komentar: "desc" },
        take: 4,
        include: { pengguna: { select: { nama_lengkap: true } } },
      }),
      prisma.news.groupBy({
        by: ["penulisId"],
        _count: { penulisId: true },
        where: { penulisId: { not: null } },
        orderBy: { _count: { penulisId: "desc" } },
        take: 4,
      }),
      prisma.comments.groupBy({
        by: ["user_id"],
        _count: { user_id: true },
        where: { user_id: { not: null } },
        orderBy: { _count: { user_id: "desc" } },
        take: 4,
      }),
      prisma.users.findMany({
        orderBy: { user_id: 'desc' },
        take: 5,
        select: { user_id: true, nama_lengkap: true, foto_url: true, jabatan_struktural: true }
      }),
      prisma.news.count({ where: { status: "published" } }),
      prisma.users.count(),
      prisma.reading_materials.count(),
    ]);

    const contributorIds = topContributors.map(c => c.penulisId).filter(id => id !== null) as bigint[];
    const commentatorIds = topCommentators.map(c => c.user_id).filter(id => id !== null) as bigint[];
    
    const userDetails = await prisma.users.findMany({
        where: { user_id: { in: [...contributorIds, ...commentatorIds] } },
        select: { user_id: true, nama_lengkap: true, foto_url: true }
    });

    const userMap = new Map(userDetails.map(u => [String(u.user_id), u]));

    const topContributorsWithDetails = topContributors
      .map(c => {
        const user = userMap.get(String(c.penulisId));
        return user ? { ...user, count: c._count?.penulisId ?? 0 } : null;
      })
      .filter(Boolean);

    const topCommentatorsWithDetails = topCommentators
      .map(c => {
        const user = userMap.get(String(c.user_id));
        return user ? { ...user, count: c._count?.user_id ?? 0 } : null;
      })
      .filter(Boolean);

    const formattedNews = latestNews.map(news => ({
        id: Number(news.news_id),
        title: news.judul,
        summary: news.abstrak,
        image: (Array.isArray(news.gambar_urls) && news.gambar_urls.length > 0) ? news.gambar_urls[0] as string : "/placeholder.png",
        // DIPERBAIKI: Menangani kemungkinan tanggal publikasi yang null
        date: news.publishedAt 
            ? new Date(news.publishedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
            : "Tanggal tidak tersedia",
        author: news.penulis?.nama_lengkap || "Anonim",
        views: news._count.likes,
        comments: news._count.komentar,
    }));

    const formattedComments = recentComments.map(comment => ({
        id: Number(comment.comment_id),
        name: comment.pengguna?.nama_lengkap || "Anonim",
        text: comment.isi_komentar || "",
    }));

    res.status(200).json({
      latestNews: formattedNews,
      recentComments: formattedComments,
      topContributors: topContributorsWithDetails,
      topCommentators: topCommentatorsWithDetails,
      onlineUsers: onlineUsers,
      quickStats: {
        beritaBaru: newsCount,
        pegawaiTerdaftar: userCount,
        dokumenTersedia: documentCount,
      }
    });

  } catch (error) {
    console.error("API Error fetching dashboard data:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  } finally {
    await prisma.$disconnect();
  }
}
