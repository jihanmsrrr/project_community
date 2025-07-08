// pages/api/organisasi/detail-unit/[kodeBps].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper untuk BigInt serialization
const bigIntToString = (value: unknown) => {
    if (typeof value === 'bigint') return value.toString();
    return value;
};

// Helper untuk kalkulasi umur
const calculateAge = (birthDate: Date | null): number => {
  if (!birthDate) return 0;
  const today = new Date();
  let age = today.getFullYear() - new Date(birthDate).getFullYear();
  const m = today.getMonth() - new Date(birthDate).getMonth();
  if (m < 0 || (m === 0 && today.getDate() < new Date(birthDate).getDate())) {
    age--;
  }
  return age;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { kodeBps } = req.query;

  if (!kodeBps || typeof kodeBps !== 'string') {
    return res.status(400).json({ message: 'Kode BPS diperlukan.' });
  }

  try {
    const unit = await prisma.organization_units.findUnique({
      where: { kode_bps: kodeBps },
      include: {
        kepala: true,
        pegawai: {
          select: {
            tanggal_lahir: true,
            status_kepegawaian: true,
            tanggal_pensiun: true,
          },
        },
        // Anda bisa tambahkan include lain jika perlu, misal untuk berita atau tim
      },
    });

    if (!unit) {
      return res.status(404).json({ message: 'Unit tidak ditemukan.' });
    }

    // Lakukan agregasi data hanya untuk satu unit ini
    const currentYear = new Date().getFullYear();
    const ages = unit.pegawai.map(p => calculateAge(p.tanggal_lahir)).filter(age => age > 0);
    const averageAge = ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0;

    const aggregatedData = {
      id: unit.kode_bps,
      namaWilayahAsli: unit.nama_wilayah,
      namaSatkerLengkap: unit.nama_satker_lengkap,
      alamat: unit.alamat_kantor,
      telepon: unit.telepon_kantor,
      web: unit.homepage_satker,
      kepalaNama: unit.kepala?.nama_lengkap || null,
      kepalaNIP: unit.kepala?.nip_baru || null,
      jumlahPegawai: unit.pegawai.length,
      jumlahPegawaiPNS: unit.pegawai.filter(p => p.status_kepegawaian === 'PNS').length,
      jumlahPensiunTahunIni: unit.pegawai.filter(p => p.tanggal_pensiun && new Date(p.tanggal_pensiun).getFullYear() === currentYear).length,
      rataUmurSatker: averageAge,
      // Tambahkan data lain yang dibutuhkan komponen StatsRow
      pejabatStruktural: [], // Isi jika perlu
      berita: [], // Isi jika perlu
      daftarTimKerja: [], // Isi jika perlu
    };
    
    const serializedData = JSON.parse(JSON.stringify(aggregatedData, (_, value) => bigIntToString(value)));

    res.status(200).json(serializedData);

  } catch (error) {
    console.error(`API /detail-unit/${kodeBps} error:`, error);
    res.status(500).json({ message: 'Gagal mengambil detail unit.' });
  }
}