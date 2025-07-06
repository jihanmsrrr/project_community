-- CreateTable
CREATE TABLE `organization_units` (
    `org_unit_id` BIGINT NOT NULL AUTO_INCREMENT,
    `nama_wilayah` VARCHAR(255) NULL,
    `kode_bps` VARCHAR(191) NULL,
    `nama_satker_lengkap` VARCHAR(255) NULL,
    `alamat_kantor` TEXT NULL,
    `telepon_kantor` VARCHAR(100) NULL,
    `homepage_satker` VARCHAR(255) NULL,
    `parent_unit_id` BIGINT NULL,
    `kepala_id` BIGINT NULL,

    UNIQUE INDEX `organization_units_kode_bps_key`(`kode_bps`),
    UNIQUE INDEX `organization_units_kepala_id_key`(`kepala_id`),
    PRIMARY KEY (`org_unit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `nama_lengkap` VARCHAR(255) NULL,
    `nip_baru` VARCHAR(20) NULL,
    `nip_lama` VARCHAR(20) NULL,
    `email` VARCHAR(255) NOT NULL,
    `unit_kerja_id` BIGINT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'user',
    `foto_url` TEXT NULL,
    `sso_id` VARCHAR(255) NULL,
    `tempat_lahir` VARCHAR(100) NULL,
    `tanggal_lahir` DATE NULL,
    `jenis_kelamin` VARCHAR(20) NULL,
    `status_kepegawaian` VARCHAR(50) NULL,
    `tmt_pns` DATE NULL,
    `pangkat_golongan` VARCHAR(100) NULL,
    `tmt_pangkat_golongan` DATE NULL,
    `jabatan_struktural` VARCHAR(255) NULL,
    `jenjang_jabatan_fungsional` VARCHAR(255) NULL,
    `tmt_jabatan` DATE NULL,
    `pendidikan_terakhir` VARCHAR(255) NULL,
    `masa_kerja_golongan` VARCHAR(50) NULL,
    `masa_kerja_total` VARCHAR(50) NULL,
    `tanggal_pensiun` DATE NULL,
    `sisa_masa_kerja` VARCHAR(50) NULL,
    `grade` VARCHAR(10) NULL,
    `unit_kerja_eselon1` VARCHAR(255) NULL,
    `unit_kerja_eselon2` VARCHAR(255) NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `users_nip_baru_key`(`nip_baru`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_sso_id_key`(`sso_id`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_education_history` (
    `education_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `jenjang` VARCHAR(191) NULL,
    `nama_sekolah_institusi` VARCHAR(191) NULL,
    `jurusan` VARCHAR(191) NULL,
    `tahun_lulus` INTEGER NULL,
    `tanggal_ijazah` DATE NULL,

    PRIMARY KEY (`education_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_job_history` (
    `job_history_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `jabatan` VARCHAR(255) NULL,
    `unit_kerja` VARCHAR(255) NULL,
    `periode_mulai` DATE NULL,
    `periode_selesai` VARCHAR(50) NULL,
    `no_sk` VARCHAR(255) NULL,
    `tmt` DATE NULL,

    PRIMARY KEY (`job_history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_competencies` (
    `competency_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `tanggal` DATE NULL,
    `nama_kompetensi` VARCHAR(255) NULL,
    `penyelenggara` VARCHAR(255) NULL,
    `nomor_sertifikat` VARCHAR(255) NULL,
    `berlaku_sampai` DATE NULL,

    PRIMARY KEY (`competency_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_achievements` (
    `achievement_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `tahun` INTEGER NULL,
    `nama_prestasi` VARCHAR(255) NULL,
    `tingkat` VARCHAR(100) NULL,
    `pemberi_penghargaan` VARCHAR(255) NULL,

    PRIMARY KEY (`achievement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `review_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `news_id` BIGINT NOT NULL AUTO_INCREMENT,
    `judul` TEXT NOT NULL,
    `abstrak` TEXT NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `kata_kunci` JSON NOT NULL,
    `isi_berita` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `nama_penulis` VARCHAR(191) NOT NULL,
    `gambar_urls` JSON NOT NULL,
    `savedAt` DATETIME(3) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `penulisId` BIGINT NOT NULL,

    PRIMARY KEY (`news_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reading_materials` (
    `material_id` BIGINT NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(255) NULL,
    `kategori` VARCHAR(100) NULL,
    `sub_kategori` VARCHAR(100) NULL,
    `deskripsi` TEXT NULL,
    `file_path` VARCHAR(255) NULL,
    `uploader_id` BIGINT NULL,
    `tanggal_upload` DATETIME(3) NULL,
    `hits` INTEGER NOT NULL DEFAULT 0,
    `slug` VARCHAR(191) NOT NULL,
    `baca_url` TEXT NOT NULL,
    `unduh_url` TEXT NOT NULL,

    UNIQUE INDEX `reading_materials_slug_key`(`slug`),
    PRIMARY KEY (`material_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `comment_id` BIGINT NOT NULL AUTO_INCREMENT,
    `news_id` BIGINT NULL,
    `user_id` BIGINT NULL,
    `username` VARCHAR(255) NULL,
    `isi_komentar` TEXT NULL,
    `tanggal_komentar` DATETIME(0) NULL,
    `parent_id` BIGINT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `team_id` BIGINT NOT NULL AUTO_INCREMENT,
    `nama_tim` VARCHAR(255) NULL,
    `singkatan` VARCHAR(50) NULL,
    `deskripsi` TEXT NULL,
    `ketua_tim_id` BIGINT NULL,
    `org_unit_id` BIGINT NULL,

    UNIQUE INDEX `teams_nama_tim_org_unit_id_key`(`nama_tim`, `org_unit_id`),
    PRIMARY KEY (`team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_memberships` (
    `team_member_id` BIGINT NOT NULL AUTO_INCREMENT,
    `team_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `posisi` VARCHAR(100) NULL,

    UNIQUE INDEX `team_memberships_team_id_user_id_key`(`team_id`, `user_id`),
    PRIMARY KEY (`team_member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `like_id` BIGINT NOT NULL AUTO_INCREMENT,
    `article_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `timestamp` DATETIME(0) NULL,

    UNIQUE INDEX `likes_article_id_user_id_key`(`article_id`, `user_id`),
    PRIMARY KEY (`like_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookmarks` (
    `bookmark_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `article_id` BIGINT NOT NULL,
    `timestamp` DATETIME(0) NULL,

    UNIQUE INDEX `bookmarks_user_id_article_id_key`(`user_id`, `article_id`),
    PRIMARY KEY (`bookmark_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `organization_units` ADD CONSTRAINT `organization_units_kepala_id_fkey` FOREIGN KEY (`kepala_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_units` ADD CONSTRAINT `organization_units_parent_unit_id_fkey` FOREIGN KEY (`parent_unit_id`) REFERENCES `organization_units`(`org_unit_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_unit_kerja_id_fkey` FOREIGN KEY (`unit_kerja_id`) REFERENCES `organization_units`(`org_unit_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_education_history` ADD CONSTRAINT `user_education_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_job_history` ADD CONSTRAINT `user_job_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_competencies` ADD CONSTRAINT `user_competencies_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_penulisId_fkey` FOREIGN KEY (`penulisId`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reading_materials` ADD CONSTRAINT `reading_materials_uploader_id_fkey` FOREIGN KEY (`uploader_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`news_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `comments`(`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_ketua_tim_id_fkey` FOREIGN KEY (`ketua_tim_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_org_unit_id_fkey` FOREIGN KEY (`org_unit_id`) REFERENCES `organization_units`(`org_unit_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_memberships` ADD CONSTRAINT `team_memberships_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_memberships` ADD CONSTRAINT `team_memberships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `news`(`news_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `news`(`news_id`) ON DELETE CASCADE ON UPDATE CASCADE;
