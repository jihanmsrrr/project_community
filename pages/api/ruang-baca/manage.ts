import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public", "files", "ruang-baca");

export const config = { api: { bodyParser: false } };

// Helper untuk mengambil nilai string pertama dari form
const getFirstValue = (value: unknown): string => {
    if (Array.isArray(value)) {
        return value[0] || '';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number' || typeof value === 'bigint') {
        return value.toString();
    }
    return '';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Pastikan direktori upload ada
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const form = new IncomingForm({
        uploadDir: UPLOAD_DIR,
        keepExtensions: true,
        // Nama file unik agar tidak ada duplikasi
        filename: (name, ext) => `${Date.now()}-${name}${ext}`,
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parsing error:", err);
            return res.status(500).json({ message: 'Gagal memproses form' });
        }

        try {
            // Normalisasi data dari form
            const judul = getFirstValue(fields.judul);
            const kategori = getFirstValue(fields.kategori);
            const sub_kategori = getFirstValue(fields.sub_kategori);
            const deskripsi = getFirstValue(fields.deskripsi);
            const uploader_id = BigInt(getFirstValue(fields.uploader_id));

            if (!judul || !kategori || !sub_kategori) {
                return res.status(400).json({ message: "Judul, Kategori, dan Sub-Kategori wajib diisi." });
            }

            let file_path = '';
            let ukuran = '0 MB';
            let fileName = '';

            if (files.file) {
                const uploadedFile = (Array.isArray(files.file) ? files.file[0] : files.file) as FormidableFile;
                if(uploadedFile && uploadedFile.size > 0) {
                    fileName = uploadedFile.originalFilename || path.basename(uploadedFile.filepath);
                    file_path = `/files/ruang-baca/${path.basename(uploadedFile.filepath)}`;
                    ukuran = `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`;
                }
            }
            
            const slug = judul.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 75);

            const dataToSave = {
                judul,
                kategori,
                sub_kategori,
                deskripsi,
                file_path,
                uploader_id,
                slug: `${slug}-${Date.now().toString().slice(-5)}`, // Tambah timestamp untuk slug unik
                bacaUrl: file_path,
                unduhUrl: file_path,
                fileName,
                ukuran,
                hits: 0,
                tahun: new Date().getFullYear(),
                tanggal_upload: new Date(),
            };

            if (req.method === 'POST') {
                const newMaterial = await prisma.reading_materials.create({
                    data: dataToSave,
                });
                return res.status(201).json({ message: 'Materi berhasil dibuat!', data: newMaterial });
            } else if (req.method === 'PATCH') {
                const { id } = req.query;
                if (!id) return res.status(400).json({ message: 'ID materi diperlukan untuk update.' });
                
                const updatedMaterial = await prisma.reading_materials.update({
                    where: { material_id: BigInt(id as string) },
                    data: dataToSave,
                });
                return res.status(200).json({ message: 'Materi berhasil diperbarui!', data: updatedMaterial });
            }
        } catch (error) {
            console.error("API Error:", error);
            return res.status(500).json({ message: "Terjadi kesalahan pada server." });
        }
    });
}