// pages/ruangbaca/[material_id].tsx
import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { PrismaClient } from "@prisma/client";

import ModulDetailComponent from "@/components/Baca/ModulDetail";
import PageTitle from "@/components/ui/PageTitle";

const prisma = new PrismaClient();

// Fungsi ini akan dijalankan di sisi server setiap kali ada request
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Akses material_id dengan aman, pastikan context.params tidak undefined
  const material_id_param = context.params?.material_id;

  // Validasi material_id: harus ada dan bukan array
  if (!material_id_param || Array.isArray(material_id_param)) {
    return { notFound: true };
  }

  const material_id = BigInt(material_id_param);

  try {
    // 1. Ambil data modul saat ini
    const modulDariDatabase = await prisma.reading_materials.findUnique({
      where: {
        material_id: material_id,
      },
      include: {
        uploader: {
          select: { nama_lengkap: true },
        },
      },
    });

    if (!modulDariDatabase) {
      console.log(
        `[SSR] Modul dengan ID ${material_id_param} tidak ditemukan.`
      );
      return { notFound: true };
    }

    // Log nilai hits sebelum di-increment
    console.log(
      `[SSR] Hits sebelum update untuk ID ${material_id_param}: ${modulDariDatabase.hits}`
    );

    // 2. Increment hits dan simpan kembali ke database
    const updatedHits = modulDariDatabase.hits + 1;
    const updatedModul = await prisma.reading_materials.update({
      where: { material_id: material_id },
      data: { hits: updatedHits },
      include: {
        uploader: {
          select: { nama_lengkap: true },
        },
      },
    });

    // Log nilai hits setelah di-increment dan disimpan (ini yang akan dikirim ke klien)
    console.log(
      `[SSR] Hits setelah update (dikirim ke klien) untuk ID ${material_id_param}: ${updatedModul.hits}`
    );

    // Konversi BigInt ke string untuk menghindari masalah serialisasi JSON
    const serializedModul = {
      ...updatedModul,
      material_id: updatedModul.material_id.toString(),
      uploader_id: updatedModul.uploader_id?.toString() || null,
      tanggal_upload: updatedModul.tanggal_upload?.toISOString() || null, // Pastikan tanggal diserialisasi dengan benar
      // Jika ada BigInt lain, konversi juga di sini
    };

    return {
      props: {
        modul: JSON.parse(JSON.stringify(serializedModul)), // Pastikan semua BigInt dikonversi
      },
    };
  } catch (error) {
    console.error(
      `[SSR] Error fetching or updating modul detail for ID ${material_id_param}:`,
      error
    );
    return {
      props: {
        modul: null,
      },
    };
  }
};

interface RuangBacaDetailPageProps {
  modul: {
    material_id: string;
    judul: string | null;
    kategori: string | null;
    sub_kategori: string | null;
    deskripsi: string | null;
    file_path: string | null;
    uploader_id: string | null;
    tanggal_upload: string | null;
    hits: number;
    uploader?: {
      nama_lengkap: string | null;
    } | null;
  } | null;
}

const SingleModulPage: React.FC<RuangBacaDetailPageProps> = ({ modul }) => {
  const router = useRouter();

  if (!modul) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center p-8">
        <AlertTriangle className="mx-auto h-16 w-16 text-status-orange mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Modul Tidak Ditemukan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Modul yang Anda cari mungkin tidak ada atau terjadi kesalahan saat
          memuat.
        </p>
        <Link href="/ruangbaca" legacyBehavior>
          <a className="inline-flex items-center gap-2 bg-brand-primary text-text-on-brand px-6 py-3 rounded-md hover:bg-brand-primary-hover transition-colors">
            <ArrowLeft size={20} /> Kembali ke Ruang Baca
          </a>
        </Link>
      </div>
    );
  }

  const handleBack = () => {
    router.push("/ruangbaca");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4 text-center">
          <PageTitle
            title={modul.judul || "Detail Materi"}
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-grow">
        <ModulDetailComponent
          modul={{
            material_id: BigInt(modul.material_id),
            judul: modul.judul,
            kategori: modul.kategori,
            sub_kategori: modul.sub_kategori,
            deskripsi: modul.deskripsi,
            file_path: modul.file_path,
            uploader_id: modul.uploader_id ? BigInt(modul.uploader_id) : null,
            tanggal_upload: modul.tanggal_upload
              ? new Date(modul.tanggal_upload)
              : null,
            hits: modul.hits, // Nilai hits sudah di-increment dan disimpan di DB oleh getServerSideProps
            uploader: modul.uploader,
          }}
          onBack={handleBack}
        />
      </main>
    </div>
  );
};

export default SingleModulPage;
