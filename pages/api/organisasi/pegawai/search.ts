// pages/api/organisasi/pegawai/search.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bigIntToString = (value: unknown) => {
    if (typeof value === 'bigint') return value.toString();
    return value;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // 1. Ambil semua parameter dari URL
    const { query, satker, biro } = req.query;

    // 2. Siapkan klausa 'where' secara dinamis
    const where: Prisma.usersWhereInput = {};
    
    // Tambahkan kondisi pencarian teks jika ada
    if (query && typeof query === 'string' && query.trim() !== '') {
      where.OR = [
        { nama_lengkap: { contains: query } },
        { nip_baru: { contains: query } },
        { email: { contains: query } },
      ];
    }

    // Tambahkan filter satuan kerja jika ada (dan bukan 'all')
    if (satker && typeof satker === 'string' && satker !== 'all') {
      // BPS Pusat menggunakan kode '0000'
      if (satker === '0000') {
        where.unit_kerja = { kode_bps: '0000' };
        
        // Jika BPS Pusat dipilih, tambahkan filter biro/eselon 1 jika ada
        if (biro && typeof biro === 'string' && biro !== 'all') {
            where.unit_kerja_eselon1 = biro;
        }

      } else {
        where.unit_kerja = { kode_bps: satker };
      }
    }

    const pegawai = await prisma.users.findMany({
      where, // Gunakan klausa where yang sudah dinamis
      select: {
        user_id: true,
        nama_lengkap: true,
        nip_baru: true,
        foto_url: true,
        unit_kerja: {
          select: {
            nama_satker_lengkap: true,
          },
        },
      },
      take: 50, // Naikkan limit agar hasil filter lebih terlihat
    });
    
    const serializedPegawai = JSON.parse(JSON.stringify(pegawai, (_, value) => bigIntToString(value)));
    
    return res.status(200).json(serializedPegawai);

  } catch (error) {
    console.error('API search error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan di server.' });
  }
}