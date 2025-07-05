// prisma/seeds/05_user_history_achievements.ts
import { PrismaClient, Prisma } from '@prisma/client';

export async function seedUserHistoryAndAchievements(prisma: PrismaClient) {
  console.log(`--- Seeding user history and achievements ---`);

  // --- Seed user_education_history ---
  const userEducationHistoryData: Prisma.user_education_historyCreateInput[] = [
    { education_id: 1, pengguna: { connect: { user_id: 1 } }, jenjang: 'S1', nama_sekolah_institusi: 'Universitas Contoh', jurusan: 'Statistika', pendidikan: null, tahun_lulus: null, tanggal_ijazah: null },
    { education_id: 2, pengguna: { connect: { user_id: 1 } }, jenjang: 'S1', nama_sekolah_institusi: 'Universitas Contoh', jurusan: 'Statistika', pendidikan: null, tahun_lulus: null, tanggal_ijazah: null },
    { education_id: 3, pengguna: { connect: { user_id: 1 } }, jenjang: 'S1', nama_sekolah_institusi: 'Universitas Contoh', jurusan: 'Statistika', pendidikan: null, tahun_lulus: null, tanggal_ijazah: null },
  ];

  for (const data of userEducationHistoryData) {
    await prisma.user_education_history.upsert({
      where: { education_id: data.education_id },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Seeded user_education_history.`);

  // --- Seed user_job_history ---
  const userJobHistoryData: Prisma.user_job_historyCreateInput[] = [
    { job_history_id: 1, pengguna: { connect: { user_id: 1 } }, jabatan: 'Staf', unit_kerja: 'Direktorat Statistik', periode_mulai: new Date('2022-03-01T00:00:00.000Z'), periode_selesai: null, no_sk: null, tmt: null },
    { job_history_id: 2, pengguna: { connect: { user_id: 1 } }, jabatan: 'Staf', unit_kerja: 'Direktorat Statistik', periode_mulai: new Date('2022-03-01T00:00:00.000Z'), periode_selesai: null, no_sk: null, tmt: null },
    { job_history_id: 3, pengguna: { connect: { user_id: 1 } }, jabatan: 'Staf', unit_kerja: 'Direktorat Statistik', periode_mulai: new Date('2022-03-01T00:00:00.000Z'), periode_selesai: null, no_sk: null, tmt: null },
  ];

  for (const data of userJobHistoryData) {
    await prisma.user_job_history.upsert({
      where: { job_history_id: data.job_history_id },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Seeded user_job_history.`);

  // --- Seed user_competencies ---
  const userCompetenciesData: Prisma.user_competenciesCreateInput[] = [
    { competency_id: 1, pengguna: { connect: { user_id: 1 } }, tanggal: null, nama_kompetensi: 'Analisis Data dengan R', penyelenggara: 'Pusdiklat BPS', nomor_sertifikat: null, berlaku_sampai: null },
    { competency_id: 2, pengguna: { connect: { user_id: 1 } }, tanggal: null, nama_kompetensi: 'Analisis Data dengan R', penyelenggara: 'Pusdiklat BPS', nomor_sertifikat: null, berlaku_sampai: null },
    { competency_id: 3, pengguna: { connect: { user_id: 1 } }, tanggal: null, nama_kompetensi: 'Analisis Data dengan R', penyelenggara: 'Pusdiklat BPS', nomor_sertifikat: null, berlaku_sampai: null },
  ];

  for (const data of userCompetenciesData) {
    await prisma.user_competencies.upsert({
      where: { competency_id: data.competency_id },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Seeded user_competencies.`);

  // --- Seed user_achievements ---
  const userAchievementsData: Prisma.user_achievementsCreateInput[] = [
    { achievement_id: 1, pengguna: { connect: { user_id: 1 } }, tahun: 2023, nama_prestasi: 'Inovasi Visualisasi Data Terbaik', tingkat: null, pemberi_penghargaan: null },
    { achievement_id: 2, pengguna: { connect: { user_id: 1 } }, tahun: 2023, nama_prestasi: 'Inovasi Visualisasi Data Terbaik', tingkat: null, pemberi_penghargaan: null },
    { achievement_id: 3, pengguna: { connect: { user_id: 1 } }, tahun: 2023, nama_prestasi: 'Inovasi Visualisasi Data Terbaik', tingkat: null, pemberi_penghargaan: null },
  ];

  for (const data of userAchievementsData) {
    await prisma.user_achievements.upsert({
      where: { achievement_id: data.achievement_id },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Seeded user_achievements.`);
}