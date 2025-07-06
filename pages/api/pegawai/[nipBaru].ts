// pages/api/pegawai/[nipBaru].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import type { DetailPegawaiData } from '@/types/pegawai'; // Import tipe yang diperbarui

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DetailPegawaiData | { message: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  const { nipBaru } = req.query; // Ambil nipBaru dari URL

  if (!nipBaru || typeof nipBaru !== 'string') {
    return res.status(400).json({ message: 'NIP Baru diperlukan.' });
  }

  try {
    const pegawai = await prisma.users.findUnique({
      where: {
        nip_baru: nipBaru, // Cari berdasarkan nip_baru
      },
      select: { // PASTIKAN SELECT INI SAMA PERSIS DENGAN YANG DI DEFINISI DetailPegawaiData DI types/pegawai.ts
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
        pendidikan_terakhir: true, // This field is on the users model
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
            org_unit_id: true, // Added: Ensure org_unit_id is selected for potential use
            nama_wilayah: true,
            kode_bps: true,
            nama_satker_lengkap: true, // Directly from your schema
            alamat_kantor: true, // Directly from your schema
            telepon_kantor: true, // Directly from your schema
            homepage_satker: true, // Directly from your schema
          }
        }
      },
    });

    if (!pegawai) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan.' });
    }

    const serializedPegawai = JSON.parse(JSON.stringify(pegawai, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )) as DetailPegawaiData;

    return res.status(200).json(serializedPegawai);

  } catch (error) {
    console.error("API /organisasi/pegawai/[nipBaru] error:", error);
    return res.status(500).json({ message: 'Gagal mengambil data detail pegawai.' });
  } finally {
    await prisma.$disconnect();
  }
}