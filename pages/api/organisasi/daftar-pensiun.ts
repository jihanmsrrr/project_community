// pages/api/organisasi/daftar-pensiun.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bigIntToString = (value: unknown) => {
    if (typeof value === 'bigint') return value.toString();
    return value;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const now = new Date();
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(now.getFullYear() + 5);

    // Ambil semua pegawai yang akan pensiun dalam 5 tahun ke depan
    const daftarPensiun = await prisma.users.findMany({
      where: {
        tanggal_pensiun: {
          gte: now, // Lebih besar atau sama dengan hari ini
          lte: fiveYearsFromNow, // Lebih kecil atau sama dengan 5 tahun dari sekarang
        },
      },
      select: {
        user_id: true,
        nama_lengkap: true,
        nip_baru: true,
        foto_url: true,
        tanggal_pensiun: true,
        unit_kerja: {
          select: {
            nama_satker_lengkap: true,
          }
        }
      },
      orderBy: {
        tanggal_pensiun: 'asc', // Urutkan dari yang paling dekat waktu pensiunnya
      },
      take: 10, // Ambil 10 teratas saja agar tidak terlalu berat
    });
    
    const serializedData = JSON.parse(JSON.stringify(daftarPensiun, (_, value) => bigIntToString(value)));

    res.status(200).json(serializedData);

  } catch (error) {
    console.error("API /daftar-pensiun error:", error);
    res.status(500).json({ message: 'Gagal mengambil data pensiun.' });
  }
}