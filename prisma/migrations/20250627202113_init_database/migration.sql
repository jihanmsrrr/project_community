-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusArtikel" AS ENUM ('draft', 'pending_review', 'published', 'revision');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "fotoUrl" TEXT,
    "nipBaru" TEXT,
    "nipLama" TEXT,
    "jabatanStruktural" TEXT,
    "jenjangJabatanFungsional" TEXT,
    "pangkatGolongan" TEXT,
    "satuanKerjaNama" TEXT,
    "namaSatkerLengkap" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artikel" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "abstrak" TEXT NOT NULL,
    "isiBerita" TEXT NOT NULL,
    "kataKunci" TEXT[],
    "status" "StatusArtikel" NOT NULL DEFAULT 'draft',
    "gambarUrls" TEXT[],
    "penulisId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Artikel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materi" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "namaTampilKategori" TEXT NOT NULL,
    "subKategori" TEXT NOT NULL,
    "ukuran" TEXT NOT NULL,
    "hits" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bacaUrl" TEXT NOT NULL,
    "unduhUrl" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Materi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nipBaru_key" ON "User"("nipBaru");

-- CreateIndex
CREATE UNIQUE INDEX "Materi_slug_key" ON "Materi"("slug");

-- AddForeignKey
ALTER TABLE "Artikel" ADD CONSTRAINT "Artikel_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
