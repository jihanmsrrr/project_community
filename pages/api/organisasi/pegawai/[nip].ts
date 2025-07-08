// pages/api/organisasi/pegawai/[nip].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper untuk mengubah BigInt menjadi String saat proses JSON
const bigIntToString = (value: unknown) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  // Mengambil 'nip' dari URL, sesuai dengan nama file [nip].ts
  const { nip } = req.query;

  if (!nip || typeof nip !== 'string') {
    return res.status(400).json({ message: 'NIP diperlukan.' });
  }

  try {
    const pegawai = await prisma.users.findUnique({
      where: {
        nip_baru: nip, // Mencari berdasarkan nip
      },
      // Menggunakan select untuk mengambil semua data yang dibutuhkan frontend
      select: {
        user_id: true,
        nama_lengkap: true,
        nip_baru: true,
        nip_lama: true,
        email: true,
        unit_kerja_id: true,
        role: true,
        foto_url: true,
        tempat_lahir: true,
        tanggal_lahir: true,
        jenis_kelamin: true,
        status_kepegawaian: true,
        tmt_pns: true,
        pangkat_golongan: true,
        tmt_pangkat_golongan: true,
        jabatan_struktural: true,
        jenjang_jabatan_fungsional: true,
        tmt_jabatan: true,
        pendidikan_terakhir: true,
        masa_kerja_golongan: true,
        masa_kerja_total: true,
        tanggal_pensiun: true,
        sisa_masa_kerja: true,
        grade: true,
        unit_kerja_eselon1: true,
        unit_kerja_eselon2: true,
        username: true,
        riwayat_pendidikan: {
          select: {
            education_id: true,
            jenjang: true,
            nama_sekolah_institusi: true,
            jurusan: true,
            tahun_lulus: true,
            tanggal_ijazah: true,
          },
        },
        riwayat_jabatan: {
          select: {
            job_history_id: true,
            jabatan: true,
            unit_kerja: true,
            periode_mulai: true,
            periode_selesai: true,
            no_sk: true,
            tmt: true,
          },
        },
        kompetensi: {
          select: {
            competency_id: true,
            tanggal: true,
            nama_kompetensi: true,
            penyelenggara: true,
            nomor_sertifikat: true,
            berlaku_sampai: true,
          },
        },
        prestasi: {
          select: {
            achievement_id: true,
            tahun: true,
            nama_prestasi: true,
            tingkat: true,
            pemberi_penghargaan: true,
          },
        },
        unit_kerja: {
          select: {
            org_unit_id: true,
            nama_wilayah: true,
            kode_bps: true,
            nama_satker_lengkap: true,
            alamat_kantor: true,
            telepon_kantor: true,
            homepage_satker: true,
          }
        }
      },
    });

    if (!pegawai) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan.' });
    }
    
    // Serialisasi data untuk mengatasi masalah BigInt
    const serializedPegawai = JSON.parse(JSON.stringify(pegawai, (_, value) => bigIntToString(value)));

    return res.status(200).json(serializedPegawai);

  } catch (error) {
    console.error(`API /organisasi/pegawai/${nip} error:`, error);
    return res.status(500).json({ message: 'Gagal mengambil data detail pegawai.' });
  } finally {
    // Disconnect dari prisma di lingkungan non-production untuk mencegah koneksi menumpuk
    if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect();
    }
  }
}