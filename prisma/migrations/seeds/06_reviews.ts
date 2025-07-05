// prisma/seeds/06_reviews.ts
import { PrismaClient, Prisma } from '@prisma/client';

export async function seedReviews(prisma: PrismaClient) {
  console.log(`--- Seeding reviews (new model) ---`);

  // --- Seed reviews (Model baru) ---
  const reviewsData: Prisma.reviewsCreateInput[] = [
    {
      rating: 5,
      comment: 'Pelayanan sangat memuaskan, sangat membantu!',
      user: { connect: { user_id: 1 } }, // KONEKSI ke user
      created_at: new Date('2025-07-04T17:00:00.000Z'),
    },
    {
      rating: 4,
      comment: 'Informasi mudah diakses, terus tingkatkan.',
      user: { connect: { user_id: 4 } }, // KONEKSI ke user
      created_at: new Date('2025-07-04T17:01:00.000Z'),
    },
    {
      rating: 5,
      comment: 'Sangat responsif dan solutif. Terima kasih!',
      user: { connect: { user_id: 2 } },
      created_at: new Date('2025-07-04T17:02:00.000Z'),
    },
    {
      rating: 3,
      comment: 'Cukup bagus, namun ada beberapa bagian yang perlu ditingkatkan.',
      user: { connect: { user_id: 3 } },
      created_at: new Date('2025-07-04T17:03:00.000Z'),
    },
  ];

  for (const data of reviewsData) {
    await prisma.reviews.create({
      data,
    });
  }
  console.log(`✅ Seeded reviews.`);
}