-- CreateTable
CREATE TABLE `organization_units` (
    `org_unit_id` BIGINT NOT NULL AUTO_INCREMENT,
    `nama_wilayah` VARCHAR(255) NULL,
    `kode_bps` VARCHAR(50) NULL,
    `nama_satker_bagian` VARCHAR(255) NULL,
    `alamat` TEXT NULL,
    `telepon` VARCHAR(50) NULL,
    `web` VARCHAR(255) NULL,
    `parent_unit_id` BIGINT NULL,
    `nama_wilayah_singkat` VARCHAR(100) NULL,
    `kepala_id` BIGINT NULL,

    UNIQUE INDEX `organization_units_kepala_id_key`(`kepala_id`),
    PRIMARY KEY (`org_unit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `nama_lengkap` VARCHAR(255) NULL,
    `nip_baru` VARCHAR(20) NULL,
    `nip_lama` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `unit_kerja_id` BIGINT NULL,
    `role` VARCHAR(50) NULL,
    `sso_id` VARCHAR(255) NULL,
    `foto_url` VARCHAR(255) NULL,
    `tempat_lahir` VARCHAR(100) NULL,
    `tanggal_lahir` DATE NULL,
    `jenis_kelamin` VARCHAR(20) NULL,
    `status_kepegawaian` VARCHAR(50) NULL,
    `tmt_pns` DATE NULL,
    `pangkat_golongan` VARCHAR(50) NULL,
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

    UNIQUE INDEX `users_nip_baru_key`(`nip_baru`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_sso_id_key`(`sso_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `news_id` BIGINT NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(255) NULL,
    `kategori` VARCHAR(100) NULL,
    `kata_kunci` TEXT NULL,
    `abstrak` TEXT NULL,
    `isi_berita` LONGTEXT NULL,
    `status` VARCHAR(50) NULL DEFAULT 'menunggu_verifikasi',
    `nama_penulis` VARCHAR(255) NULL,
    `penulis_id` BIGINT NULL,
    `gambar_urls` JSON NULL,
    `lampiran_urls` JSON NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `published_at` DATETIME(0) NULL,

    PRIMARY KEY (`news_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reading_materials` (
    `material_id` BIGINT NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(255) NULL,
    `kategori` VARCHAR(100) NULL,
    `file_path` VARCHAR(255) NULL,
    `uploader_id` BIGINT NULL,
    `tanggal_upload` DATETIME(0) NULL,

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

    UNIQUE INDEX `teams_ketua_tim_id_key`(`ketua_tim_id`),
    PRIMARY KEY (`team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_memberships` (
    `team_member_id` BIGINT NOT NULL AUTO_INCREMENT,
    `team_id` BIGINT NULL,
    `user_id` BIGINT NULL,
    `posisi` VARCHAR(100) NULL,

    PRIMARY KEY (`team_member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `like_id` BIGINT NOT NULL AUTO_INCREMENT,
    `article_id` BIGINT NULL,
    `user_id` BIGINT NULL,
    `timestamp` DATETIME(0) NULL,

    PRIMARY KEY (`like_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookmarks` (
    `bookmark_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NULL,
    `article_id` BIGINT NULL,
    `timestamp` DATETIME(0) NULL,

    PRIMARY KEY (`bookmark_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_education_history` (
    `education_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NULL,
    `jenjang` VARCHAR(50) NULL,
    `nama_sekolah_institusi` VARCHAR(255) NULL,
    `jurusan` VARCHAR(255) NULL,
    `pendidikan` VARCHAR(255) NULL,
    `tahun_lulus` INTEGER NULL,
    `tanggal_ijazah` DATE NULL,

    PRIMARY KEY (`education_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_job_history` (
    `job_history_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NULL,
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
    `user_id` BIGINT NULL,
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
    `user_id` BIGINT NULL,
    `tahun` INTEGER NULL,
    `nama_prestasi` VARCHAR(255) NULL,
    `tingkat` VARCHAR(100) NULL,
    `pemberi_penghargaan` VARCHAR(255) NULL,

    PRIMARY KEY (`achievement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `organization_units` ADD CONSTRAINT `organization_units_kepala_id_fkey` FOREIGN KEY (`kepala_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_units` ADD CONSTRAINT `organization_units_parent_unit_id_fkey` FOREIGN KEY (`parent_unit_id`) REFERENCES `organization_units`(`org_unit_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_unit_kerja_id_fkey` FOREIGN KEY (`unit_kerja_id`) REFERENCES `organization_units`(`org_unit_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_penulis_id_fkey` FOREIGN KEY (`penulis_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reading_materials` ADD CONSTRAINT `reading_materials_uploader_id_fkey` FOREIGN KEY (`uploader_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`news_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `comments`(`comment_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_ketua_tim_id_fkey` FOREIGN KEY (`ketua_tim_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_org_unit_id_fkey` FOREIGN KEY (`org_unit_id`) REFERENCES `organization_units`(`org_unit_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_memberships` ADD CONSTRAINT `team_memberships_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_memberships` ADD CONSTRAINT `team_memberships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `news`(`news_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `news`(`news_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_education_history` ADD CONSTRAINT `user_education_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_job_history` ADD CONSTRAINT `user_job_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_competencies` ADD CONSTRAINT `user_competencies_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
