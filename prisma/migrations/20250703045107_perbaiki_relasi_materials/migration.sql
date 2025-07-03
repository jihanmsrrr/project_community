/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `reading_materials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baca_url` to the `reading_materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `reading_materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unduh_url` to the `reading_materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reading_materials` ADD COLUMN `baca_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `unduh_url` VARCHAR(191) NOT NULL,
    MODIFY `tanggal_upload` DATETIME(3) NULL,
    ALTER COLUMN `hits` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `reading_materials_slug_key` ON `reading_materials`(`slug`);
