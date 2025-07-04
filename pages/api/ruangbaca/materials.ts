// pages/api/ruangbaca/materials.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client'; // Impor tipe Prisma
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();
export const config = { api: { bodyParser: false } };
const uploadDir = path.join(process.cwd(), "/public/files/ruangbaca");

const jsonReplacer = (key: string, value: unknown) => typeof value === 'bigint' ? value.toString() : value;

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const form = formidable({ uploadDir, keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // --- Method GET (Dengan logika filter yang sudah lengkap) ---
    if (req.method === 'GET') {
        try {
            // Ambil semua parameter yang mungkin dari URL
            const { search, kategori, sub_kategori } = req.query;

            // Siapkan kondisi 'where' untuk Prisma
            const where: Prisma.reading_materialsWhereInput = {};

            // 1. Tambahkan filter untuk kata kunci (search)
            if (search && typeof search === 'string') {
                where.OR = [
                    { judul: { contains: search } },
                    { deskripsi: { contains: search } },
                ];
            }

            // 2. Tambahkan filter untuk kategori
            if (kategori && typeof kategori === 'string') {
                where.kategori = kategori;
            }

            // 3. Tambahkan filter untuk sub-kategori
            if (sub_kategori && typeof sub_kategori === 'string') {
                where.sub_kategori = sub_kategori;
            }

            const materials = await prisma.reading_materials.findMany({
                where, // Terapkan semua filter yang aktif
                include: { uploader: { select: { nama_lengkap: true } } },
                orderBy: { tanggal_upload: 'desc' },
            });
            
            return res.status(200).setHeader('Content-Type', 'application/json').send(JSON.stringify(materials, jsonReplacer));
        } catch (error) {
            console.error("API GET Error:", error);
            return res.status(500).json({ message: "Gagal mengambil data materi." });
        }
    }

    // --- Method POST (Tetap sama, sudah benar) ---
    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user?.id) {
            return res.status(401).json({ message: "Akses ditolak. Anda harus login untuk mengunggah materi." });
        }
        try {
            const { fields, files } = await parseForm(req);
            const { judul, kategori, sub_kategori, deskripsi } = fields;
            const fileOrFiles = files.file;
            const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles;

            if (!file || file.size === 0) return res.status(400).json({ message: 'File materi yang valid wajib diunggah.' });
            if (!judul || !kategori) return res.status(400).json({ message: 'Judul dan Kategori wajib diisi.' });

            const judulStr = Array.isArray(judul) ? judul[0] : judul;
            
            const createdMaterial = await prisma.reading_materials.create({
                data: {
                    judul: judulStr,
                    kategori: Array.isArray(kategori) ? kategori[0] : kategori,
                    sub_kategori: Array.isArray(sub_kategori) ? sub_kategori[0] : sub_kategori,
                    deskripsi: Array.isArray(deskripsi) ? deskripsi[0] : deskripsi,
                    file_path: file.newFilename,
                    uploader_id: BigInt(session.user.id),
                    hits: 0,
                    tanggal_upload: new Date(),
                    slug: `${judulStr.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}-${Date.now()}`,
                    bacaUrl: `/files/ruangbaca/${file.newFilename}`,
                    unduhUrl: `/files/ruangbaca/${file.newFilename}`,
                },
            });
            
            return res.status(201).setHeader('Content-Type', 'application/json').send(JSON.stringify(createdMaterial, jsonReplacer));
        } catch (error) {
            console.error("API POST Error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.';
            return res.status(500).json({ message: 'Gagal memproses permintaan.', error: errorMessage });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
