// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// Import fungsi seed dari file-file terpisah menggunakan path relatif
import { seedOrganizationAndUsers } from './migrations/seeds/01_organization_users';
import { seedNewsAndMaterials } from './migrations/seeds/02_news_materials';
import { seedCommentsLikesBookmarks } from './migrations/seeds/03_comments_likes_bookmarks';
import { seedTeams } from './migrations/seeds/04_teams';
import { seedUserHistoryAndAchievements } from './migrations/seeds/05_user_history_achievements';
import { seedReviews } from './migrations/seeds/06_reviews';

const prisma = new PrismaClient();

async function main() {
  console.log(`🚀 Starting full database seeding orchestration...`);

  // Urutan seeding penting karena adanya relasi antar tabel!
  // organization_units dan users harus di-seed duluan
  await seedOrganizationAndUsers(prisma);
  // news dan reading_materials bergantung pada users
  await seedNewsAndMaterials(prisma);
  // comments, likes, bookmarks bergantung pada users dan news
  await seedCommentsLikesBookmarks(prisma);
  // teams dan team_memberships bergantung pada users dan organization_units
  await seedTeams(prisma);
  // user_history_achievements bergantung pada users
  await seedUserHistoryAndAchievements(prisma);
  // reviews bergantung pada users
  await seedReviews(prisma);

  console.log(`🎉 All seeding finished successfully!`);
}

main()
  .catch((e) => {
    console.error(`❌ Seeding failed:`, e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });