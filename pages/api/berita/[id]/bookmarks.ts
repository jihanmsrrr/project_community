// pages/api/berita/bookmarks.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type BookmarksDB = { [userId: string]: number[] };
const BOOKMARKS_PATH = path.join(process.cwd(), 'data', 'bookmarks.json');

// Helper untuk membaca file
const readBookmarksFile = (): BookmarksDB => {
  try {
    if (!fs.existsSync(BOOKMARKS_PATH)) return {};
    const data = fs.readFileSync(BOOKMARKS_PATH, 'utf-8');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Gagal membaca bookmarks.json:", error);
    return {};
  }
};

// Helper untuk menulis file
const writeBookmarksFile = (data: BookmarksDB) => {
  try {
    fs.writeFileSync(BOOKMARKS_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Gagal menulis ke bookmarks.json:", error);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // --- Handler untuk GET ---
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Parameter userId diperlukan.' });
    }
    const bookmarks = readBookmarksFile();
    const userBookmarks = bookmarks[userId] || [];
    return res.status(200).json({ savedArticles: userBookmarks });
  }

  // --- Handler untuk POST ---
  if (req.method === 'POST') {
    const { userId, articleId } = req.body;
    if (!userId || !articleId) {
      return res.status(400).json({ message: 'Parameter userId dan articleId diperlukan.' });
    }

    const bookmarks = readBookmarksFile();
    const userBookmarks = bookmarks[userId] || [];
    const articleIndex = userBookmarks.indexOf(articleId);

    if (articleIndex > -1) {
      userBookmarks.splice(articleIndex, 1); // Un-save
    } else {
      userBookmarks.push(articleId); // Save
    }

    bookmarks[userId] = userBookmarks;
    writeBookmarksFile(bookmarks);
    return res.status(200).json({ success: true, savedArticles: userBookmarks });
  }

  // Jika method bukan GET atau POST, kirim 405 Method Not Allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}