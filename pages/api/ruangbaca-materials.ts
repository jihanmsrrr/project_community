// pages/api/ruangbaca-materials.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const materials = await prisma.reading_materials.findMany({
        // Sertakan relasi uploader untuk menampilkan nama di MateriCard jika diperlukan
        include: {
          uploader: {
            select: { nama_lengkap: true },
          },
        },
        orderBy: {
          tanggal_upload: 'desc', // Urutkan default berdasarkan tanggal terbaru
        },
      });

      // Serialisasi BigInt dan Date objects ke string karena tidak bisa langsung di-JSON-kan
      const serializedMaterials = materials.map(material => ({
        ...material,
        material_id: material.material_id.toString(),
        uploader_id: material.uploader_id?.toString() || null,
        tanggal_upload: material.tanggal_upload?.toISOString() || null, // Ubah Date ke ISO string
      }));

      res.status(200).json(serializedMaterials);
    } catch (error) {
      console.error("Error fetching all reading materials from database:", error);
      res.status(500).json({ message: "Gagal mengambil materi bacaan." });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
