// pages/api/_helpers.ts

import fs from 'fs';
import path from 'path';
import type { ArtikelBerita } from '@/types/varia';

const DATA_PATH = path.join(process.cwd(), 'data', 'berita.json');

export function readBeritaFile(): ArtikelBerita[] {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      console.warn('File berita.json tidak ditemukan, mengembalikan array kosong.');
      return [];
    }

    const fileContents = fs.readFileSync(DATA_PATH, 'utf-8');
    // Menangani jika file JSON kosong
    return fileContents ? JSON.parse(fileContents) : [];
  } catch (error) {
    console.error("Gagal membaca atau parse berita.json:", error);
    // Jika terjadi error, kembalikan array kosong agar aplikasi tidak crash
    return [];
  }
}