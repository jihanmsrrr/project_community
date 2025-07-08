// pages/api/organisasi/list-satker.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const satkerList = await prisma.organization_units.findMany({
      // Hanya pilih kolom yang kita butuhkan untuk filter
      select: {
        org_unit_id: true,
        nama_wilayah: true,
        kode_bps: true,
      },
      orderBy: {
        nama_wilayah: 'asc', // Urutkan berdasarkan abjad
      },
    });

    // Handle BigInt serialization
    const serializedSatkerList = JSON.parse(JSON.stringify(satkerList, (_, value) => 
        typeof value === 'bigint' ? value.toString() : value
    ));

    res.status(200).json(serializedSatkerList);
  } catch (error) {
    console.error('API /list-satker error:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar satuan kerja.' });
  }
}