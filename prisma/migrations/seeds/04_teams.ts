// prisma/seeds/04_teams.ts
import { PrismaClient, Prisma } from '@prisma/client';

export async function seedTeams(prisma: PrismaClient) {
  console.log(`--- Seeding teams and team_memberships ---`);

  // --- Seed teams ---
  const teamsData: Prisma.teamsCreateInput[] = [
    {
      team_id: 1,
      nama_tim: 'Tim Publikasi Internal',
      singkatan: 'TPI',
      deskripsi: 'Tim yang bertanggung jawab atas konten di portal komunitas.',
      // ketua_tim_id: null di dump, kita default ke user_id 1 (Arianto)
      ketua_tim: { connect: { user_id: 1 } },
      // org_unit_id: 1 di dump, kita hubungkan ke org_unit_id 1
      unit_kerja: { connect: { org_unit_id: 1 } },
    },
  ];

  for (const data of teamsData) {
    await prisma.teams.upsert({
      where: { team_id: data.team_id },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Seeded teams.`);

  // --- Seed team_memberships ---
  const teamMembershipsData: Prisma.team_membershipsCreateInput[] = [
    {
      team_member_id: 1,
      // team_id: 1 di dump, kita hubungkan ke team_id 1
      tim: { connect: { team_id: 1 } },
      // user_id: null di dump, kita default ke user_id 1 (Arianto)
      pengguna: { connect: { user_id: 1 } },
      posisi: 'Anggota Konten',
    },
  ];

  for (const data of teamMembershipsData) {
    await prisma.team_memberships.upsert({
      where: { team_member_id: data.team_member_id },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Seeded team_memberships.`);
}