// pages/api/profile.ts
import { getSession } from 'next-auth/react'; // Menggunakan getSession untuk API Routes di Pages Router
import { PrismaClient } from '@prisma/client';

// ✅ PERBAIKAN: Gunakan inisialisasi PrismaClient yang lebih aman untuk Next.js
// Ini mencegah pembuatan instance PrismaClient baru setiap kali API dipanggil
// yang bisa menyebabkan terlalu banyak koneksi database.
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // --- PERBAIKAN: Hapus @ts-expect-error yang tidak terpakai ---
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// ✅ PERBAIKAN: Tambahkan serializer JSON kustom untuk menangani BigInt
// Fungsi ini akan mengganti nilai BigInt menjadi string sebelum di-serialize ke JSON
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function() {
  return this.toString();
};


import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Pastikan hanya metode GET yang diizinkan
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Dapatkan sesi pengguna dari request
  const session = await getSession({ req });

  // Periksa apakah pengguna sudah terautentikasi
  if (!session || !session.user || !session.user.id) {
    console.warn('Unauthorized access attempt to /api/profile: No session or user ID found.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Ambil ID pengguna dari sesi
    const userId = BigInt(session.user.id); // Menggunakan BigInt() untuk konversi

    // Cari semua detail pengguna di database berdasarkan user_id
    const userProfile = await prisma.users.findUnique({
      where: { user_id: userId }, // Gunakan userId yang sudah bertipe BigInt
      // Pilih kolom yang ingin Anda tampilkan.
      // Hindari mengirimkan password atau data sensitif lainnya.
      select: {
        user_id: true,
        nama_lengkap: true,
        nip_baru: true,
        nip_lama: true,
        email: true,
        role: true,
        sso_id: true,
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
        // Jangan sertakan 'password' di sini!
      },
    });

    if (!userProfile) {
      console.warn(`User profile not found for ID: ${userId}`);
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Kirim data profil pengguna sebagai respons
    // Karena kita sudah menambahkan toJSON ke BigInt.prototype, ini akan berfungsi
    return res.status(200).json(userProfile);

  } catch (error: unknown) {
    console.error('Error fetching user profile:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Internal Server Error', details: errorMessage });
  } finally {
    // Tidak perlu disconnect di sini jika menggunakan inisialisasi global PrismaClient
  }
}