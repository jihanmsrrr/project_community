// pages/api/berita/user-activity.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client'; // Import Prisma dan tipenya

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end('Method Not Allowed');
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'userId diperlukan.' });
    }

    try {
        const userBigIntId = BigInt(userId);

        // Tipe utilitas untuk hasil kueri
        type BookmarkedRecord = Prisma.bookmarksGetPayload<{ include: { berita: true } }>;
        type LikedRecord = Prisma.likesGetPayload<{ include: { berita: true } }>;
        type CommentedRecord = Prisma.commentsGetPayload<{ select: { berita: true } }>; // Perhatikan select

        // 1. Dapatkan artikel yang di-bookmark oleh pengguna
        const bookmarkedUserRecords = await prisma.bookmarks.findMany({
            where: {
                user_id: userBigIntId,
            },
            include: {
                berita: true,
            },
        });
        // PERBAIKAN: Beri tipe eksplisit pada parameter map
        const bookmarkedArticles = bookmarkedUserRecords.map((record: BookmarkedRecord) => record.berita).filter(Boolean);

        // 2. Dapatkan artikel yang disukai oleh pengguna
        const likedUserRecords = await prisma.likes.findMany({
            where: {
                user_id: userBigIntId,
            },
            include: {
                berita: true,
            },
        });
        // PERBAIKAN: Beri tipe eksplisit pada parameter map
        const likedArticles = likedUserRecords.map((record: LikedRecord) => record.berita).filter(Boolean);

        // 3. Dapatkan artikel yang dikomentari oleh pengguna
        const commentedUserRecords = await prisma.comments.findMany({
            where: {
                user_id: userBigIntId,
                parent_id: null,
            },
            distinct: ['news_id'],
            select: {
                news_id: true,
                berita: true,
            },
        });
        // PERBAIKAN: Beri tipe eksplisit pada parameter map
        const commentedArticles = commentedUserRecords.map((record: CommentedRecord) => record.berita).filter(Boolean);

        const serializedResponse = JSON.parse(JSON.stringify({
            bookmarked: bookmarkedArticles,
            liked: likedArticles,
            commented: commentedArticles,
        }, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return res.status(200).json(serializedResponse);

    } catch (error) {
        console.error("API user-activity error:", error);
        return res.status(500).json({ message: 'Gagal mengambil data aktivitas.' });
    } finally {
        await prisma.$disconnect();
    }
}