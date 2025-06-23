// /pages/api/berita.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File as FormidableFile, Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
// --- PERBAIKAN KUNCI: Impor tipe data dari satu sumber terpusat ---
import { ArtikelBerita } from "@/types/varia";

// Konfigurasi API Route
export const config = {
  api: {
    bodyParser: false, // Wajib false agar formidable bisa mem-parse form-data
  },
};

// --- PATH KONSTAN ---
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "berita.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "berita");

// --- DIHAPUS: Tipe 'Berita' lokal tidak lagi digunakan ---
// interface Berita { ... }

// --- FUNGSI HELPER UNTUK MEMBACA/MENULIS DATABASE (berita.json) ---
// --- PERBAIKAN: Fungsi sekarang menggunakan tipe 'ArtikelBerita' yang diimpor ---
function readBeritaFile(): ArtikelBerita[] {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      // Jika file tidak ada, buat file kosong dengan array di dalamnya
      fs.writeFileSync(DATA_PATH, "[]", "utf-8");
      return [];
    }
    const fileContents = fs.readFileSync(DATA_PATH, "utf-8");
    // Jika file kosong, kembalikan array kosong untuk menghindari error parse
    return fileContents ? JSON.parse(fileContents) : [];
  } catch (error) {
    console.error("Gagal membaca atau parse berita.json:", error);
    return [];
  }
}

function writeBeritaFile(data: ArtikelBerita[]) {
  try {
    // Pastikan direktori 'data' ada
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Tulis data ke file dengan format yang rapi (null, 2 untuk indentasi)
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Gagal menulis ke berita.json:", error);
  }
}

// Helper untuk mengambil nilai pertama dari form, karena formidable bisa mengembalikan array
const getFirstValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
};

// --- HANDLER UTAMA API ROUTE ---
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // === Handler untuk GET (Untuk Halaman Admin) ===
  if (req.method === "GET") {
    try {
      const allBerita = readBeritaFile();
      // PERBAIKAN: Admin tidak perlu melihat 'draft' di tabel manajemen utama
      const dataForAdmin = allBerita.filter(p => p.status !== 'draft');
      return res.status(200).json(dataForAdmin);
    } catch (error) {
      console.error("API GET Error:", error);
      return res.status(500).json({ message: "Gagal mengambil data berita." });
    }
  }

  // === Handler untuk POST (Membuat Artikel Baru) ===
  if (req.method === "POST") {
    // Pastikan folder upload ada
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const form = new IncomingForm({
      multiples: true,
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      // Batasi ukuran file, contoh 5MB
      maxFileSize: 5 * 1024 * 1024,
    });

    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(500).json({ message: "Gagal memproses data form.", error: err.message });
      }

      const judul = getFirstValue(fields.judul);
      const kategori = getFirstValue(fields.kategori);
      const abstrak = getFirstValue(fields.abstrak);
      const isiBerita = getFirstValue(fields.isiBerita);
      const status = getFirstValue(fields.status) as ArtikelBerita['status'];
      // PERBAIKAN: Ambil nama penulis dari form, dengan nilai default
      const namaPenulis = getFirstValue(fields.namaPenulis) || "Kontributor";

      if (!judul || !kategori || !abstrak || !isiBerita || !status) {
        return res.status(400).json({ message: "Data wajib tidak lengkap." });
      }

      const kataKunci = getFirstValue(fields.kataKunci).split(',').map(k => k.trim()).filter(Boolean);

      let gambarFiles: ArtikelBerita['gambarFiles'] = [];
      if (files.gambarFiles) {
        const fileArray = Array.isArray(files.gambarFiles) ? files.gambarFiles : [files.gambarFiles];
        gambarFiles = fileArray.map((f: FormidableFile) => ({
          originalFilename: f.originalFilename ?? "unknown_file",
          mimetype: f.mimetype ?? undefined,
          size: f.size,
          url: `/uploads/berita/${path.basename(f.filepath)}`
        }));
      }

      try {
        const existingBerita = readBeritaFile();
        const newBerita: ArtikelBerita = {
          id: Date.now(),
          judul, kategori, kataKunci, abstrak, isiBerita, status, namaPenulis,
          gambarFiles,
          savedAt: Date.now(),
        };

        existingBerita.unshift(newBerita); // Tambahkan ke awal array
        writeBeritaFile(existingBerita);
        return res.status(201).json({ message: "Berita berhasil disimpan!", data: newBerita });
      } catch (error) {
        console.error("Gagal menyimpan data ke file:", error);
        return res.status(500).json({ message: "Gagal menyimpan data ke file." });
      }
    });
    return; // Wajib ada untuk menghentikan eksekusi karena form.parse async
  }

  // === Handler untuk PATCH (Update Status: Approve/Revisi) ===
  if (req.method === "PATCH") {
    try {
      const { id, status } = req.query;

      if (!id || !status || typeof status !== 'string' || !['published', 'revision', 'pending_review'].includes(status)) {
        return res.status(400).json({ message: "Parameter 'id' dan 'status' yang valid diperlukan." });
      }

      const beritaId = parseInt(id as string, 10);
      const allBerita = readBeritaFile();
      const beritaIndex = allBerita.findIndex(p => p.id === beritaId);

      if (beritaIndex === -1) {
        return res.status(404).json({ message: "Berita tidak ditemukan." });
      }

      allBerita[beritaIndex].status = status as ArtikelBerita['status'];
      writeBeritaFile(allBerita);

      return res.status(200).json({ message: "Status berita berhasil diperbarui.", data: allBerita[beritaIndex] });
    } catch (error) {
      console.error("API PATCH Error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  // === Handler untuk DELETE (Menghapus Artikel) ===
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Parameter 'id' diperlukan." });

      const beritaId = parseInt(id as string, 10);
      const allBerita = readBeritaFile();
      const updatedBerita = allBerita.filter(p => p.id !== beritaId);

      if (allBerita.length === updatedBerita.length) {
        return res.status(404).json({ message: "Berita tidak ditemukan untuk dihapus." });
      }

      writeBeritaFile(updatedBerita);
      return res.status(200).json({ message: "Berita berhasil dihapus." });
    } catch (error) {
      console.error("API DELETE Error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  // Jika method tidak diizinkan
  res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}