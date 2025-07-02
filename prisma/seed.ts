import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding lengkap untuk users...');

  // 1. Upsert Pengguna Admin
  await prisma.users.upsert({
    where: { email: 'admin.utama@bps.go.id' },
    update: {},
    create: {
      nama_lengkap: 'Admin Utama',
      nip_baru: '199001012020011001',
      nip_lama: '199001011990011001',
      email: 'admin.utama@bps.go.id',
      unit_kerja_id: 2,
      role: 'admin',
      sso_id: 'sso-admin-utama',
      foto_url: 'https://example.com/foto_admin.jpg',
      tempat_lahir: 'Jakarta',
      tanggal_lahir: new Date('1990-01-15T00:00:00.000Z'),
      jenis_kelamin: 'Laki-laki',
      status_kepegawaian: 'PNS',
      tmt_pns: new Date('2015-07-01T00:00:00.000Z'),
      pangkat_golongan: 'IV/A',
      tmt_pangkat_golongan: new Date('2020-07-01T00:00:00.000Z'),
      jabatan_struktural: 'Kepala Bagian Umum',
      jenjang_jabatan_fungsional: null,
      tmt_jabatan: new Date('2023-01-01T00:00:00.000Z'),
      pendidikan_terakhir: 'S2',
      masa_kerja_golongan: '10 Tahun',
      masa_kerja_total: '15 Tahun',
      tanggal_pensiun: new Date('2050-01-15T00:00:00.000Z'),
      sisa_masa_kerja: '25 Tahun',
      grade: '10',
      unit_kerja_eselon1: 'Sekretariat Utama',
      unit_kerja_eselon2: 'Biro Umum',
      username: 'admin123',
      password: 'adminpassword',
    },
  });

  // 2. Upsert Pengguna User Biasa 1
  await prisma.users.upsert({
    where: { email: 'pegawai.pusat@bps.go.id' },
    update: {},
    create: {
      nama_lengkap: 'Pegawai Pusat Contoh',
      nip_baru: '199505052022031002',
      nip_lama: '199505051995051001',
      email: 'pegawai.pusat@bps.go.id',
      unit_kerja_id: 1,
      role: 'user',
      sso_id: 'sso-pegawai-pusat',
      foto_url: 'https://example.com/foto_user1.jpg',
      tempat_lahir: 'Bandung',
      tanggal_lahir: new Date('1995-05-20T00:00:00.000Z'),
      jenis_kelamin: 'Perempuan',
      status_kepegawaian: 'PNS',
      tmt_pns: new Date('2017-09-01T00:00:00.000Z'),
      pangkat_golongan: 'III/B',
      tmt_pangkat_golongan: new Date('2022-09-01T00:00:00.000Z'),
      jabatan_struktural: null,
      jenjang_jabatan_fungsional: 'Statistisi Ahli Muda',
      tmt_jabatan: new Date('2024-03-01T00:00:00.000Z'),
      pendidikan_terakhir: 'S1',
      masa_kerja_golongan: '3 Tahun',
      masa_kerja_total: '8 Tahun',
      tanggal_pensiun: new Date('2055-05-20T00:00:00.000Z'),
      sisa_masa_kerja: '30 Tahun',
      grade: '8',
      unit_kerja_eselon1: 'Deputi Bidang Statistik Sosial',
      unit_kerja_eselon2: 'Direktorat Statistik Kependudukan dan Ketenagakerjaan',
      username: 'user001',
      password: 'useronepass',
    },
  });

  // 3. Upsert Pengguna User Biasa 2
  await prisma.users.upsert({
    where: { email: 'pegawai.jabar@bps.go.id' },
    update: {},
    create: {
      nama_lengkap: 'Pegawai Jabar Contoh',
      nip_baru: '199606062022031003',
      nip_lama: '199606061996061001',
      email: 'pegawai.jabar@bps.go.id',
      unit_kerja_id: 2,
      role: 'user',
      sso_id: 'sso-pegawai-jabar',
      foto_url: 'https://example.com/foto_user2.jpg',
      tempat_lahir: 'Surabaya',
      tanggal_lahir: new Date('1996-11-10T00:00:00.000Z'),
      jenis_kelamin: 'Laki-laki',
      status_kepegawaian: 'PNS',
      tmt_pns: new Date('2019-05-01T00:00:00.000Z'),
      pangkat_golongan: 'III/A',
      tmt_pangkat_golongan: new Date('2024-05-01T00:00:00.000Z'),
      jabatan_struktural: null,
      jenjang_jabatan_fungsional: 'Pranata Komputer Ahli Pertama',
      tmt_jabatan: new Date('2023-07-01T00:00:00.000Z'),
      pendidikan_terakhir: 'S1',
      masa_kerja_golongan: '1 Tahun',
      masa_kerja_total: '6 Tahun',
      tanggal_pensiun: new Date('2056-11-10T00:00:00.000Z'),
      sisa_masa_kerja: '31 Tahun',
      grade: '7',
      unit_kerja_eselon1: 'Deputi Bidang Statistik Produksi',
      unit_kerja_eselon2: 'Direktorat Statistik Industri',
      username: 'user002',
      password: 'usertwopass',
    },
  });

  console.log('✅ Proses seeding untuk users selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });