-- AlterTable
ALTER TABLE `reading_materials` ADD COLUMN `deskripsi` TEXT NULL,
    ADD COLUMN `hits` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `sub_kategori` VARCHAR(100) NULL;
