/*
  Warnings:

  - Added the required column `nipLama` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `nipBaru` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jabatanStruktural` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jenjangJabatanFungsional` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pangkatGolongan` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `satuanKerjaNama` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaSatkerLengkap` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nipLama" TEXT NOT NULL,
ALTER COLUMN "nipBaru" SET NOT NULL,
ALTER COLUMN "jabatanStruktural" SET NOT NULL,
ALTER COLUMN "jenjangJabatanFungsional" SET NOT NULL,
ALTER COLUMN "pangkatGolongan" SET NOT NULL,
ALTER COLUMN "satuanKerjaNama" SET NOT NULL,
ALTER COLUMN "namaSatkerLengkap" SET NOT NULL;
