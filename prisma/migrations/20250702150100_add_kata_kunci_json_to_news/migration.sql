/*
  Warnings:

  - You are about to drop the column `abstrak` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `lampiran_urls` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `penulis_id` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `published_at` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `news` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[news_id]` on the table `news` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `penulisId` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `savedAt` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `news` table without a default value. This is not possible if the table is not empty.
  - Made the column `judul` on table `news` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kategori` on table `news` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kata_kunci` on table `news` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isi_berita` on table `news` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `news` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nama_penulis` on table `news` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gambar_urls` on table `news` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `news` DROP FOREIGN KEY `news_penulis_id_fkey`;

-- DropIndex
DROP INDEX `news_penulis_id_fkey` ON `news`;

-- AlterTable
ALTER TABLE `news` DROP COLUMN `abstrak`,
    DROP COLUMN `created_at`,
    DROP COLUMN `lampiran_urls`,
    DROP COLUMN `penulis_id`,
    DROP COLUMN `published_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `penulisId` BIGINT NOT NULL,
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    ADD COLUMN `savedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `news_id` BIGINT NOT NULL,
    MODIFY `judul` VARCHAR(191) NOT NULL,
    MODIFY `kategori` VARCHAR(191) NOT NULL,
    MODIFY `kata_kunci` JSON NOT NULL,
    MODIFY `isi_berita` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL,
    MODIFY `nama_penulis` VARCHAR(191) NOT NULL,
    MODIFY `gambar_urls` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `news_news_id_key` ON `news`(`news_id`);

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_penulisId_fkey` FOREIGN KEY (`penulisId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
