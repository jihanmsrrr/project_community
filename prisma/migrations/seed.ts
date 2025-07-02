import { PrismaClient } from '@prisma/client';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding...');

  // 1. Upsert Unit Kerja Pusat (Buat jika belum ada, lewati jika sudah ada)
  console.log('Memastikan unit kerja ada...');
  const unitKerjaPusat = await prisma.organization_units.upsert({
    where: { org_unit_id: 1 }, // Atau gunakan field unik lain jika ada
    update: {}, // Jangan lakukan apa-apa jika sudah ada
    create: {
      nama_satker_bagian: 'BPS Pusat',
      nama_wilayah: 'Nasional',
      kode_bps: '0000',
    },
  });

  // 2. Upsert Pengguna (Admin dan User Biasa)
  console.log('Memastikan pengguna ada...');
  const adminUser = await prisma.users.upsert({
    where: { email: 'admin.utama@bps.go.id' }, // Cari berdasarkan email yang unik
    update: {}, // Jangan lakukan apa-apa jika sudah ada
    create: {
      nama_lengkap: 'Admin Utama',
      email: 'admin.utama@bps.go.id',
      nip_baru: '199001012020011001',
      sso_id: 'sso-admin-utama',
      role: 'admin',
      unit_kerja_id: unitKerjaPusat.org_unit_id,
      pangkat_golongan: 'Pembina (IV/a)',
      jabatan_struktural: 'Kepala Bagian Umum',
    },
  });

  const userBiasa = await prisma.users.upsert({
    where: { email: 'pegawai.contoh@bps.go.id' }, // Cari berdasarkan email yang unik
    update: {},
    create: {
      nama_lengkap: 'Pegawai Contoh',
      email: 'pegawai.contoh@bps.go.id',
      nip_baru: '199505052022031002',
      sso_id: 'sso-pegawai-contoh',
      role: 'user',
      unit_kerja_id: unitKerjaPusat.org_unit_id,
      pangkat_golongan: 'Penata Muda (III/a)',
      jenjang_jabatan_fungsional: 'Pranata Komputer Ahli Pertama',
    },
  });

  // 3. Upsert Berita Awal
  console.log('Memastikan berita awal ada...');
  await prisma.news.upsert({
    where: { judul: 'Selamat Datang di Portal BPS Community!' },
    update: {},
    create: {
      judul: 'Selamat Datang di Portal BPS Community!',
      kategori: 'Pengumuman',
      abstrak: 'Ini adalah portal komunitas internal untuk seluruh pegawai BPS.',
      isi_berita: 'Melalui portal ini, kita dapat berbagi informasi, pengetahuan, dan berkolaborasi untuk BPS yang lebih baik.',
      status: 'published',
      penulis_id: adminUser.user_id,
      nama_penulis: adminUser.nama_lengkap,
      published_at: new Date(),
    },
  });
  
  // 4. Upsert Riwayat Pendidikan
  console.log('Memastikan riwayat pendidikan ada...');
  await prisma.user_education_history.upsert({
    where: { 
      // Kita perlu ID unik di sini. Jika tidak ada, kita harus mencari cara lain.
      // Untuk contoh ini, kita asumsikan kombinasi user_id dan jenjang adalah unik.
      // Note: Ini hanya untuk seeding, di aplikasi nyata perlu penanganan lebih baik.
      user_id_jenjang: {
        user_id: userBiasa.user_id,
        jenjang: 'S1',
      }
    },
    update: {},
    create: {
      user_id: userBiasa.user_id,
      jenjang: 'S1',
      nama_sekolah_institusi: 'Universitas Contoh Indonesia',
      jurusan: 'Ilmu Komputer',
      tahun_lulus: 2018,
    },
  });


  // 5. INI BAGIAN BARUNYA: Upsert Riwayat Prestasi
  console.log('Memastikan riwayat prestasi ada...');
  await prisma.user_achievements.upsert({
    where: { 
      // Kita perlu ID unik. Kita asumsikan kombinasi user dan nama prestasi adalah unik.
      user_id_nama_prestasi: {
        user_id: userBiasa.user_id,
        nama_prestasi: 'Pegawai Teladan Tingkat Nasional',
      }
    },
    update: {},
    create: {
      user_id: userBiasa.user_id,
      tahun: 2023,
      nama_prestasi: 'Pegawai Teladan Tingkat Nasional',
      tingkat: 'Nasional',
      pemberi_penghargaan: 'BPS Pusat'
    },
  });


  console.log('✅ Proses seeding selesai.');
}

// Menjalankan fungsi utama dan menangani error
main()
  .catch((e) => {
    console.error('❌ Terjadi error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Menutup koneksi Prisma
    await prisma.$disconnect();
  });