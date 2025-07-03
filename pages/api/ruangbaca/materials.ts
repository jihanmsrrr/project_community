// File: pages/api/ruangbaca/materials.ts
// Format untuk Pages Router, BUKAN App Router

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Helper untuk mengubah BigInt menjadi string saat mengirim JSON
function jsonReplacer(key: string, value: unknown) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Izinkan hanya metode GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Di Pages Router, query parameter diambil dari req.query
    const { search, kategori, sub_kategori } = req.query;

    const where: Prisma.reading_materialsWhereInput = {};

    if (kategori && typeof kategori === 'string') {
      where.kategori = kategori;
    }
    if (sub_kategori && typeof sub_kategori === 'string') {
      where.sub_kategori = sub_kategori;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { judul: { contains: search } },
        { deskripsi: { contains: search } },
      ];
    }

    const materials = await prisma.reading_materials.findMany({
      where,
      include: { uploader: { select: { nama_lengkap: true } } },
      orderBy: { hits: 'desc' },
    });

    // Menggunakan replacer untuk menangani BigInt saat mengirim respons
    const body = JSON.stringify(materials, jsonReplacer);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(body);

  } catch (error) {
    console.error("API Error fetching reading materials:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({ 
      message: "Terjadi kesalahan pada server saat mengambil data.",
      errorDetails: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
}