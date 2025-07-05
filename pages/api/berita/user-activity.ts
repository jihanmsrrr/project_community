// pages/api/berita/user-activity.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

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

        // 1. Dapatkan artikel yang di-bookmark oleh pengguna
        const bookmarkedUserRecords = await prisma.bookmarks.findMany({
            where: {
                user_id: userBigIntId,
            },
            include: {
                berita: true, // Sertakan detail artikel terkait
            },
        });
        const bookmarkedArticles = bookmarkedUserRecords.map(record => record.berita).filter(Boolean);

        // 2. Dapatkan artikel yang disukai oleh pengguna
        const likedUserRecords = await prisma.likes.findMany({
            where: {
                user_id: userBigIntId,
            },
            include: {
                berita: true, // Sertakan detail artikel terkait
            },
        });
        const likedArticles = likedUserRecords.map(record => record.berita).filter(Boolean);

        // 3. Dapatkan artikel yang dikomentari oleh pengguna
        // PERBAIKAN: Gunakan 'select' dan pastikan kolom 'news_id' dipilih
        const commentedUserRecords = await prisma.comments.findMany({
            where: {
                user_id: userBigIntId,
                parent_id: null, // Hanya ambil komentar level teratas dari pengguna ini
            },
            distinct: ['news_id'], // Mengambil hanya satu komentar per berita_id dari pengguna
            select: { // Menggunakan 'select' untuk memilih kolom
                news_id: true, // Harus memilih kolom yang di-distinct
                berita: true,  // Memilih objek berita penuh melalui relasi
            },
        });

        // Map ke array artikel saja
        // Jika berita bisa null di select: { berita: true }, tambahkan filter(Boolean)
        const commentedArticles = commentedUserRecords.map(record => record.berita).filter(Boolean);

        // Serialisasi BigInt ke string untuk semua data yang dikembalikan
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