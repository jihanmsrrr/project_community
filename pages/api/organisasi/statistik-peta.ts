// pages/api/organisasi/statistik-peta.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tipe data untuk respons API ini
export type StatistikPetaData = {
  id: string;          // Akan berisi kode_bps, misal: "1100"
  label: string;       // Akan berisi nama_wilayah, misal: "Aceh"
  value: number;       // Akan berisi jumlah pegawai
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatistikPetaData[] | { message: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 1. Ambil semua unit organisasi, kecuali BPS Pusat
    const units = await prisma.organization_units.findMany({
      where: {
        // Filter agar BPS Pusat (kode 0000) tidak ikut
        NOT: {
          kode_bps: '0000',
        },
      },
      // 2. Pilih hanya data yang dibutuhkan & hitung jumlah pegawai
      select: {
        kode_bps: true,
        nama_wilayah: true,
        _count: { // Fitur efisien dari Prisma untuk menghitung relasi
          select: {
            pegawai: true,
          },
        },
      },
    });

    // 3. Ubah (transformasi) data menjadi format yang lebih sederhana untuk frontend
    const dataUntukPeta: StatistikPetaData[] = units.map(unit => ({
      id: unit.kode_bps || '',
      label: unit.nama_wilayah || 'Tidak Diketahui',
      value: unit._count.pegawai,
    }));

    // 4. Kirim data yang sudah bersih dan ringan
    return res.status(200).json(dataUntukPeta);

  } catch (error) {
    console.error("API /statistik-peta error:", error);
    return res.status(500).json({ message: 'Gagal mengambil data statistik peta.' });
  } finally {
     if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect();
    }
  }
}