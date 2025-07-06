// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { seedOrganizationsAndUsers } from './seeds/01_organizations_users';
import { seedContentAndInteractions } from './seeds/02_content_and_interactions';
import { seedUserDetailsAndReviews } from './seeds/03_details_reviews';
import { seedReadingMaterials } from './seeds/04_reading_materials';


const prisma = new PrismaClient();

async function main() {
  console.log(`🚀 Memulai proses seeding utama...`);

  // Menjalankan semua proses seeding di dalam satu transaksi
  // Jika ada satu bagian yang gagal, semua perubahan akan dibatalkan (rollback).
  await prisma.$transaction(async (tx) => {
    // NOTE: `tx` adalah Prisma Client khusus untuk transaksi ini.
    // Kita akan meneruskannya ke setiap fungsi seed.
    
    // Urutan sangat penting!
    // 1. Buat struktur organisasi, user, dan tim terlebih dahulu.
    await seedOrganizationsAndUsers(tx);

    // 2. Setelah user dan berita ada, buat konten dan interaksinya.
    await seedContentAndInteractions(tx);

    // 3. Terakhir, tambahkan detail untuk setiap user.
    await seedUserDetailsAndReviews(tx);
      await seedReadingMaterials(tx);
  });

  console.log(`\n🎉 Semua proses seeding telah selesai dengan sukses!`);
}

main()
  .catch(async (e) => {
    console.error("❌ Terjadi error pada proses seeding utama:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
