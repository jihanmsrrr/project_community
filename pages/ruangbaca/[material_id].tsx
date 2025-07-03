// pages/ruangbaca/[material_id].tsx
import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, HardDriveDownload } from "lucide-react";
import { PrismaClient } from "@prisma/client";

import ModulDetailComponent from "@/components/Baca/ModulDetail";
import PageTitle from "@/components/ui/PageTitle";
import MateriCard from "@/components/Baca/MateriCard"; // Diperlukan untuk Bacaan Terkait

const prisma = new PrismaClient();

// Interface untuk data rekomendasi
interface RecommendedMaterial {
  material_id: string;
  judul: string | null;
  kategori: string | null;
  sub_kategori: string | null;
  deskripsi: string | null;
  file_path: string | null;
  hits: number;
  uploader?: { nama_lengkap: string | null } | null;
  uploader_id?: string | null; // Tambahkan jika diperlukan di MateriCard
  tanggal_upload?: string | null; // Tambahkan jika diperlukan di MateriCard
}

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
  // Menambahkan props untuk rekomendasi
  recommendedMaterials: RecommendedMaterial[];
}

// Fungsi ini akan dijalankan di sisi server setiap kali ada request
export const getServerSideProps: GetServerSideProps<
  RuangBacaDetailPageProps
> = async (context) => {
  const material_id_param = context.params?.material_id;

  if (!material_id_param || Array.isArray(material_id_param)) {
    return { notFound: true };
  }

  const material_id = BigInt(material_id_param);
  let modulDariDatabase = null;
  let recommendedMaterials: RecommendedMaterial[] = [];

  try {
    // 1. Ambil data modul saat ini
    modulDariDatabase = await prisma.reading_materials.findUnique({
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

    // 3. Ambil Bacaan Terkait / Populer
    // Logika: Ambil materi dari kategori yang sama, atau yang paling populer (hits tertinggi)
    const relatedOrPopularMaterials = await prisma.reading_materials.findMany({
      where: {
        material_id: { not: material_id }, // Jangan ambil materi yang sedang dilihat
        OR: [
          { kategori: modulDariDatabase.kategori }, // Materi dari kategori yang sama
          { sub_kategori: modulDariDatabase.sub_kategori }, // Materi dari sub-kategori yang sama
        ],
      },
      orderBy: {
        hits: "desc", // Urutkan berdasarkan hits tertinggi
      },
      take: 4, // Ambil 4 materi rekomendasi
      select: {
        // Hanya ambil field yang dibutuhkan MateriCard
        material_id: true,
        judul: true,
        kategori: true,
        sub_kategori: true,
        deskripsi: true,
        file_path: true,
        hits: true,
        uploader: { select: { nama_lengkap: true } },
        uploader_id: true,
        tanggal_upload: true,
      },
    });

    // Jika tidak ada materi terkait, ambil 4 materi terpopuler secara umum
    if (relatedOrPopularMaterials.length === 0) {
      const mostPopularMaterials = await prisma.reading_materials.findMany({
        where: {
          material_id: { not: material_id },
        },
        orderBy: {
          hits: "desc",
        },
        take: 4,
        select: {
          material_id: true,
          judul: true,
          kategori: true,
          sub_kategori: true,
          deskripsi: true,
          file_path: true,
          hits: true,
          uploader: { select: { nama_lengkap: true } },
          uploader_id: true,
          tanggal_upload: true,
        },
      });
      recommendedMaterials = mostPopularMaterials.map((material) => ({
        ...material,
        material_id: material.material_id.toString(),
        uploader_id: material.uploader_id?.toString() || null,
        tanggal_upload: material.tanggal_upload?.toString() || null,
      }));
    } else {
      recommendedMaterials = relatedOrPopularMaterials.map((material) => ({
        ...material,
        material_id: material.material_id.toString(),
        uploader_id: material.uploader_id?.toString() || null,
        tanggal_upload: material.tanggal_upload?.toString() || null,
      }));
    }

    // Konversi BigInt dan Date ke string untuk serialisasi JSON
    const serializedModul = {
      ...updatedModul,
      material_id: updatedModul.material_id.toString(),
      uploader_id: updatedModul.uploader_id?.toString() || null,
      tanggal_upload: updatedModul.tanggal_upload?.toISOString() || null,
    };

    const serializedRecommendedMaterials = recommendedMaterials.map(
      (material) => ({
        ...material,
        material_id: material.material_id.toString(),
        uploader_id: material.uploader_id?.toString() || null,
        tanggal_upload: material.tanggal_upload?.toString() || null,
      })
    );

    return {
      props: {
        modul: JSON.parse(JSON.stringify(serializedModul)),
        recommendedMaterials: JSON.parse(
          JSON.stringify(serializedRecommendedMaterials)
        ),
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
        recommendedMaterials: [], // Kosongkan rekomendasi jika ada error
      },
    };
  }
};

const SingleModulPage: React.FC<RuangBacaDetailPageProps> = ({
  modul,
  recommendedMaterials,
}) => {
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

      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Preview File */}
          <div className="lg:col-span-8 xl:col-span-9">
            <ModulDetailComponent
              modul={{
                material_id: BigInt(modul.material_id),
                judul: modul.judul,
                kategori: modul.kategori,
                sub_kategori: modul.sub_kategori,
                deskripsi: modul.deskripsi,
                file_path: modul.file_path,
                uploader_id: modul.uploader_id
                  ? BigInt(modul.uploader_id)
                  : null,
                tanggal_upload: modul.tanggal_upload
                  ? new Date(modul.tanggal_upload)
                  : null,
                hits: modul.hits,
                uploader: modul.uploader,
              }}
              onBack={handleBack}
            />
          </div>

          {/* Kolom Kanan: Sidebar Detail dan Rekomendasi */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-20 space-y-8">
              {/* Box Detail Materi (Sama seperti kolom kanan sebelumnya di ModulDetailComponent) */}
              <div className="bg-surface-card rounded-xl shadow-lg p-6 border border-ui-border">
                <h2 className="text-xl font-bold text-text-primary mb-3 leading-tight">
                  Detail Materi
                </h2>
                <div className="space-y-2 text-sm text-text-secondary">
                  <p>
                    <strong>Judul:</strong> {modul.judul || "-"}
                  </p>
                  <p>
                    <strong>Kategori:</strong> {modul.kategori || "-"}
                  </p>
                  {modul.sub_kategori && (
                    <p>
                      <strong>Sub-Kategori:</strong> {modul.sub_kategori}
                    </p>
                  )}
                  <p>
                    <strong>Uploader:</strong>{" "}
                    {modul.uploader?.nama_lengkap || "-"}
                  </p>
                  <p>
                    <strong>Dilihat:</strong>{" "}
                    {modul.hits.toLocaleString("en-US")} kali
                  </p>
                  <p>
                    <strong>Tanggal Upload:</strong>{" "}
                    {modul.tanggal_upload
                      ? new Date(modul.tanggal_upload).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </p>
                </div>
                {modul.deskripsi && (
                  <div className="mt-4 pt-4 border-t border-ui-border/50">
                    <h3 className="font-semibold text-text-primary mb-2">
                      Deskripsi
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {modul.deskripsi}
                    </p>
                  </div>
                )}
                <a
                  href={modul.file_path ? `/files/${modul.file_path}` : "#"}
                  download={modul.file_path || undefined}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-text-on-brand px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
                  aria-label={`Unduh modul ${modul.judul || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HardDriveDownload size={20} />
                  Unduh Modul
                </a>
              </div>

              {/* Box Bacaan Terkait / Populer */}
              {recommendedMaterials.length > 0 && (
                <div className="bg-surface-card rounded-xl shadow-lg p-6 border border-ui-border">
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    Bacaan Terkait / Populer
                  </h3>
                  <div className="space-y-4">
                    {recommendedMaterials.map((recModul) => (
                      <MateriCard
                        key={recModul.material_id}
                        modul={{
                          material_id: BigInt(recModul.material_id),
                          judul: recModul.judul,
                          kategori: recModul.kategori,
                          sub_kategori: recModul.sub_kategori,
                          deskripsi: recModul.deskripsi,
                          file_path: recModul.file_path,
                          hits: recModul.hits,
                          uploader: recModul.uploader,
                          uploader_id: recModul.uploader_id
                            ? BigInt(recModul.uploader_id)
                            : null,
                          tanggal_upload: recModul.tanggal_upload
                            ? new Date(recModul.tanggal_upload)
                            : null,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SingleModulPage;
