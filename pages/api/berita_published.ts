// /pages/api/berita-published.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { ArtikelBerita } from '@/types/varia';

const DATA_PATH = path.join(process.cwd(), "data", "berita.json");

function readBeritaFile(): ArtikelBerita[] {
  try {
    const fileContents = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(fileContents);
  } catch {
    return [];
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ArtikelBerita[] | { message: string }>
) {
  if (req.method === 'GET') {
    try {
      const allArticles = readBeritaFile();
      const publishedArticles = allArticles.filter(
        (article) => article.status === 'published'
      );
      res.status(200).json(publishedArticles);
    } catch {
      res.status(500).json({ message: 'Gagal mengambil data berita.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}