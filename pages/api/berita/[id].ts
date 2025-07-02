// pages/api/berita/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { ArtikelBerita } from "@/types/varia";

// Helper untuk membaca file JSON database kita
function readBeritaFile(): ArtikelBerita[] {
  const DATA_PATH = path.join(process.cwd(), "data", "berita.json");
  try {
    if (!fs.existsSync(DATA_PATH)) {
      console.error("Database file tidak ditemukan di:", DATA_PATH);
      return [];
    }
    const fileContents = fs.readFileSync(DATA_PATH, "utf-8");
    return fileContents ? JSON.parse(fileContents) : [];
  } catch (error) {
    console.error("Gagal membaca atau parse berita.json:", error);
    return [];
  }
}

// Handler utama untuk route ini
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Hanya izinkan metode GET untuk route ini
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 2. Ambil 'id' dari parameter URL, contoh: /api/berita/12345
  const { id } = req.query;

  // 3. Pastikan 'id' ada di dalam request
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: "Parameter 'id' diperlukan." });
  }

  try {
    // 4. Baca semua data berita dari file JSON
    const allBerita = readBeritaFile();
    // Ubah id dari string menjadi angka agar bisa dibandingkan
    const beritaId = parseInt(id, 10);

    // 5. Cari satu artikel yang ID-nya cocok
    const artikel = allBerita.find(p => p.id === beritaId);

    // 6. Tentukan respons berdasarkan hasil pencarian
    if (artikel) {
      // Jika ditemukan, kirim data artikel tersebut dengan status 200 OK
      return res.status(200).json(artikel);
    } else {
      // Jika tidak ditemukan, kirim pesan error dengan status 404 Not Found
      return res.status(404).json({ message: "Berita tidak ditemukan." });
    }
  } catch (error) {
    // Tangani jika ada error tak terduga saat proses berjalan
    console.error(`API Error for ID ${id}:`, error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}