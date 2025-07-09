/*
  Warnings:

  - You are about to drop the `Pengumuman` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Pengumuman`;

-- CreateTable
CREATE TABLE `pengumuman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `gambarUrl` TEXT NOT NULL,
    `isiPengumuman` TEXT NOT NULL,
    `targetUrl` TEXT NOT NULL,
    `tanggalMulai` DATE NOT NULL,
    `tanggalBerakhir` DATE NOT NULL,
    `aktif` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
