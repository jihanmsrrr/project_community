// pages/api/ruangbaca/materials/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();
export const config = { api: { bodyParser: false } };
const uploadDir = path.join(process.cwd(), "/public/files/ruangbaca");

// Helper untuk mengubah BigInt menjadi string saat mengirim JSON
const jsonReplacer = (key: string, value: unknown) => typeof value === 'bigint' ? value.toString() : value;

// Fungsi untuk mem-parsing form dengan formidable
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
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: "ID materi tidak valid." });
    }
    const materialId = BigInt(id);

    // Ambil sesi untuk otorisasi pada method PUT dan DELETE
    const session = await getServerSession(req, res, authOptions);

    switch (req.method) {
        case 'GET':
            try {
                const material = await prisma.reading_materials.findUnique({ where: { material_id: materialId } });
                if (!material) return res.status(404).json({ message: "Materi tidak ditemukan." });
                // Gunakan jsonReplacer untuk GET juga
                return res.status(200).setHeader('Content-Type', 'application/json').send(JSON.stringify(material, jsonReplacer));
            } catch {
                return res.status(500).json({ message: "Gagal mengambil data." });
            }

        case 'PUT':
            if (!session || !session.user?.id) {
                return res.status(401).json({ message: "Akses ditolak. Anda harus login untuk mengupdate materi." });
            }
            try {
                const existingMaterial = await prisma.reading_materials.findUnique({ where: { material_id: materialId } });
                if (!existingMaterial) return res.status(404).json({ message: "Materi yang akan diupdate tidak ditemukan." });

                const { fields, files } = await parseForm(req);
                const { judul, kategori, sub_kategori, deskripsi } = fields;
                
                // --- PERBAIKAN UTAMA: Cara mengambil file dibuat lebih aman ---
                // Ini untuk menangani kasus di mana 'formidable' mungkin mengembalikan array
                const fileOrFiles = files.file;
                const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles;
                
                const judulStr = Array.isArray(judul) ? judul[0] : judul;

                // Siapkan data yang akan diupdate
                const dataToUpdate: Prisma.reading_materialsUpdateInput = {
                    judul: judulStr,
                    kategori: Array.isArray(kategori) ? kategori[0] : kategori,
                    sub_kategori: Array.isArray(sub_kategori) ? sub_kategori[0] : sub_kategori,
                    deskripsi: Array.isArray(deskripsi) ? deskripsi[0] : deskripsi,
                    slug: `${(judulStr || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}-${Date.now()}`,
                };

                // Cek apakah ada file baru yang valid diunggah (punya ukuran > 0)
                if (file && file.size > 0) {
                    // Hapus file lama jika ada
                    if (existingMaterial.file_path) {
                        const oldFilePath = path.join(uploadDir, existingMaterial.file_path);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                        }
                    }
                    // Hanya update path file jika ada file baru
                    dataToUpdate.file_path = file.newFilename;
                    dataToUpdate.bacaUrl = `/files/ruangbaca/${file.newFilename}`;
                    dataToUpdate.unduhUrl = `/files/ruangbaca/${file.newFilename}`;
                }

                const updatedMaterial = await prisma.reading_materials.update({
                    where: { material_id: materialId },
                    data: dataToUpdate,
                });

                return res.status(200).setHeader('Content-Type', 'application/json').send(JSON.stringify(updatedMaterial, jsonReplacer));

            } catch (error) {
                console.error("API PUT Error:", error);
                return res.status(500).json({ message: 'Gagal mengupdate data.', error: (error as Error).message });
            }

        case 'DELETE':
            if (!session || !session.user?.id) {
                return res.status(401).json({ message: "Akses ditolak. Anda harus login untuk menghapus materi." });
            }
            try {
                const materialToDelete = await prisma.reading_materials.findUnique({ where: { material_id: materialId } });
                if (!materialToDelete) return res.status(404).json({ message: "Materi yang akan dihapus tidak ditemukan." });

                if (materialToDelete.file_path) {
                    const filePathToDelete = path.join(uploadDir, materialToDelete.file_path);
                    if (fs.existsSync(filePathToDelete)) fs.unlinkSync(filePathToDelete);
                }

                await prisma.reading_materials.delete({ where: { material_id: materialId } });
                return res.status(204).end();
            } catch {
                return res.status(500).json({ message: "Gagal menghapus data." });
            }

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
