// prisma/seeds/05_details_and_reviews.ts
import type { Prisma, PrismaClient } from '@prisma/client';

type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export async function seedUserDetailsAndReviews(tx: TransactionClient) {
    console.log(`-> Memasukkan detail riwayat user dan ulasan...`);
    
    await tx.user_education_history.deleteMany({});
    await tx.user_job_history.deleteMany({});
    await tx.user_competencies.deleteMany({});
    await tx.user_achievements.deleteMany({});
    await tx.reviews.deleteMany({});

    const allUsers = await tx.users.findMany();
    if(allUsers.length === 0) {
        console.log("  ⚠️ Tidak ada user untuk dibuatkan detail riwayat.");
        return;
    }

    const educationHistory: Prisma.user_education_historyCreateManyInput[] = [];
    const jobHistory: Prisma.user_job_historyCreateManyInput[] = [];
    const competencies: Prisma.user_competenciesCreateManyInput[] = [];
    const achievements: Prisma.user_achievementsCreateManyInput[] = [];

    for (const user of allUsers) {
        // Buat 1-2 riwayat pendidikan
        educationHistory.push({ user_id: user.user_id, jenjang: 'S1', nama_sekolah_institusi: 'Universitas Gadjah Mada', jurusan: 'Ilmu Komputer', tahun_lulus: 2018 });
        if (user.pendidikan_terakhir === 'S2') {
             educationHistory.push({ user_id: user.user_id, jenjang: 'S2', nama_sekolah_institusi: 'Institut Teknologi Bandung', jurusan: 'Magister Statistik', tahun_lulus: 2021 });
        }
        
        // Buat 2 riwayat jabatan
        jobHistory.push({ user_id: user.user_id, jabatan: 'Staf Fungsional', unit_kerja: 'BPS Kabupaten/Kota', periode_mulai: new Date('2019-03-01'), periode_selesai: '2022-02-28' });
        jobHistory.push({ user_id: user.user_id, jabatan: user.jenjang_jabatan_fungsional || user.jabatan_struktural || 'Staf Ahli', unit_kerja: 'BPS Provinsi', periode_mulai: new Date('2022-03-01'), periode_selesai: 'Sekarang' });

        // Buat 1-3 kompetensi
        for (let i = 0; i < randomInt(1, 3); i++) {
            competencies.push({ user_id: user.user_id, nama_kompetensi: randomPick(['Manajemen Proyek Statistik', 'Analisis Data dengan R', 'Visualisasi Data Tableau']), penyelenggara: 'Pusdiklat BPS', tanggal: randomDate(new Date(2020, 0, 1), new Date()) });
        }
        
        // Buat 0-2 prestasi
        if (Math.random() > 0.5) {
            achievements.push({ user_id: user.user_id, tahun: randomInt(2021, 2024), nama_prestasi: 'Pegawai Teladan Tingkat ' + randomPick(['Nasional', 'Provinsi']), tingkat: randomPick(['Nasional', 'Provinsi']) });
        }
    }

    await tx.user_education_history.createMany({ data: educationHistory });
    await tx.user_job_history.createMany({ data: jobHistory });
    await tx.user_competencies.createMany({ data: competencies });
    await tx.user_achievements.createMany({ data: achievements });
    console.log(`  ✅ Seeded details for ${allUsers.length} users.`);

    // Seed Ulasan dengan target rata-rata 4.96
    // FIX: Menggunakan tipe `reviewsCreateManyInput` yang benar untuk `createMany`
    const reviewsToCreate: Prisma.reviewsCreateManyInput[] = [];
    const sampleComments = [
        'Pelayanan sangat memuaskan, sangat membantu!', 'Informasi mudah diakses, terus tingkatkan.',
        'Sangat responsif dan solutif. Terima kasih!', 'Cukup bagus, namun ada beberapa bagian yang perlu ditingkatkan.'
    ];
    const totalReviews = 1000;
    const num4Stars = 40;
    const num5Stars = totalReviews - num4Stars;
    
    const usersForReview = allUsers.slice(0, totalReviews);

    for(let i = 0; i < totalReviews; i++) {
        const user = usersForReview[i % usersForReview.length]; // Ulangi user jika < 1000
        reviewsToCreate.push({
            rating: i < num5Stars ? 5 : 4,
            comment: randomPick(sampleComments),
            // FIX: Menggunakan `user_id` langsung, bukan objek `connect`
            user_id: user.user_id 
        });
    }
    
    await tx.reviews.createMany({ data: reviewsToCreate, skipDuplicates: true });
    console.log(`  ✅ Seeded ${reviewsToCreate.length} reviews with a target average of 4.96.`);
}

export {};
