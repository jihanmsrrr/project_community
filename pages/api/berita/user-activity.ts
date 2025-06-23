// pages/api/user-activity.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { ArtikelBerita } from '@/types/varia';
import { readBeritaFile } from './_helpers';
import fs from 'fs';
import path from 'path';

// --- DEFINISI TIPE & HELPER ---
type BookmarksDB = { [userId: string]: number[] };
type LikesDB = { [articleId: string]: string[] };
type Comment = { commentId: number; username:string; text: string; timestamp: number };
// FIX 2: Mengganti 'astring' menjadi 'string'
type CommentsDB = { [articleId: string]: Comment[] };

// --- OPTIMASI PERFORMA: Caching Sederhana ---
// Variabel ini akan menyimpan data di memori setelah dibaca pertama kali
let cachedData: {
    allBerita: ArtikelBerita[];
    bookmarks: BookmarksDB;
    likes: LikesDB;
    comments: CommentsDB;
} | null = null;

const readJsonFile = <T>(filePath: string): T => {
    try {
        const fullPath = path.join(process.cwd(), 'data', filePath);
        if (!fs.existsSync(fullPath)) return {} as T;
        const data = fs.readFileSync(fullPath, 'utf-8');
        return data ? JSON.parse(data) : ({} as T);
    } catch (error) {
        console.error(`Gagal membaca file JSON: ${filePath}`, error);
        return {} as T;
    }
};

const initializeData = () => {
    if (cachedData === null) {
        console.log("Membaca data dari file untuk pertama kali...");
        cachedData = {
            allBerita: readBeritaFile(),
            bookmarks: readJsonFile<BookmarksDB>('bookmarks.json'),
            likes: readJsonFile<LikesDB>('likes.json'),
            comments: readJsonFile<CommentsDB>('comments.json'),
        };
    }
    return cachedData;
};

// --- API HANDLER ---
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).end('Method Not Allowed');
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'userId diperlukan.' });
    }

    try {
        // PERFORMA: Ambil data dari cache (atau baca file jika cache kosong)
        const { allBerita, bookmarks, likes, comments } = initializeData();

        // 1. Dapatkan artikel yang disimpan oleh pengguna
        const bookmarkedIds = bookmarks[userId] || [];
        const bookmarkedArticles = allBerita.filter(artikel => bookmarkedIds.includes(artikel.id));

        // 2. Dapatkan artikel yang disukai oleh pengguna
        const likedIds = Object.keys(likes)
            .filter(articleId => likes[articleId].includes(userId))
            .map(id => parseInt(id, 10)); // Pastikan konversi ke number
        const likedArticles = allBerita.filter(artikel => likedIds.includes(artikel.id));

        // 3. Dapatkan artikel yang dikomentari oleh pengguna
        // FIX 1: Menggunakan 'userId' dari query, bukan localStorage
        const commentedIds = Object.keys(comments)
            .filter(articleId => comments[articleId].some(comment => comment.username === userId))
            .map(id => parseInt(id, 10));
        const commentedArticles = allBerita.filter(artikel => commentedIds.includes(artikel.id));

        return res.status(200).json({
            bookmarked: bookmarkedArticles,
            liked: likedArticles,
            commented: commentedArticles,
        });

    } catch (error) {
        console.error("API user-activity error:", error);
        return res.status(500).json({ message: 'Gagal mengambil data aktivitas.' });
    }
}