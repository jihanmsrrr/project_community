/*
  Warnings:

  - Added the required column `abstrak` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `news` ADD COLUMN `abstrak` VARCHAR(191) NOT NULL;
