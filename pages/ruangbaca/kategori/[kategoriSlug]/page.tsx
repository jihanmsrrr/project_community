// app/ruangbaca/kategori/[kategoriSlug]/page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MateriCard from "@/components/Baca/MateriCard"; // Pastikan path ini benar
import PageTitle from "@/components/ui/PageTitle"; // Pastikan path ini benar
import { LoaderCircle, AlertTriangle, ArrowLeft } from "lucide-react";

// Definisikan tipe data yang sama, ini sudah benar
interface ApiMaterial {
  material_id: string;
  judul: string | null;
  kategori: string | null;
  sub_kategori: string | null;
  deskripsi: string | null;
  file_path: string | null;
  uploader_id: string | null;
  tanggal_upload: string | null;
  hits: number;
  uploader?: { nama_lengkap: string | null } | null;
}

export default function DetailKategoriPage() {
  const params = useParams();
  const kategoriNama = useMemo(() => {
    const slug = params.kategoriSlug as string;
    return slug ? decodeURIComponent(slug) : "";
  }, [params.kategoriSlug]);

  const [materials, setMaterials] = useState<ApiMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // --- PERBAIKAN PADA useEffect ---
  useEffect(() => {
    if (!kategoriNama) return;

    const fetchMaterials = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        // ✅ Kirim request ke API dengan query parameter kategori
        // encodeURIComponent penting untuk menangani spasi atau karakter spesial
        const response = await fetch(
          `/api/ruangbaca-materials?kategori=${encodeURIComponent(
            kategoriNama
          )}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data materi untuk kategori ini");
        }

        // ✅ Data yang diterima sudah terfilter dari server, tidak perlu filter manual lagi
        const data: ApiMaterial[] = await response.json();
        setMaterials(data);
      } catch (err) {
        console.error("Error fetching materials for category:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, [kategoriNama]); // Dependency tetap sama

  // Kelompokkan materi berdasarkan sub-kategori (logika ini tetap sama dan sudah benar)
  const groupedBySubKategori = useMemo(() => {
    const groups: { [key: string]: ApiMaterial[] } = {};
    materials.forEach((material) => {
      const subKategori = material.sub_kategori || "Lainnya";
      if (!groups[subKategori]) {
        groups[subKategori] = [];
      }
      groups[subKategori].push(material);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [materials]);

  // renderContent dan return JSX Anda sebagian besar sudah bagus,
  // jadi kita pertahankan strukturnya.
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20">
          <LoaderCircle className="mx-auto h-12 w-12 text-brand-primary animate-spin" />
          <p className="mt-4">
            {`Memuat materi untuk kategori "${kategoriNama}"...`}
          </p>
        </div>
      );
    }
    if (hasError) {
      return (
        <div className="text-center py-20 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 font-semibold text-red-700">Terjadi kesalahan</p>
          <p className="text-red-600">Tidak dapat memuat data.</p>
        </div>
      );
    }
    if (materials.length === 0) {
      return (
        <div className="text-center py-20">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4">Tidak ada materi ditemukan untuk kategori ini.</p>
        </div>
      );
    }
    return (
      <div className="space-y-12">
        {groupedBySubKategori.map(([subKategori, modulItems]) => (
          <section key={subKategori}>
            <h2 className="text-2xl font-semibold border-b pb-3 mb-6 text-text-primary">
              {subKategori}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {modulItems.map((modul) => (
                <MateriCard
                  key={modul.material_id}
                  modul={{
                    material_id: String(modul.material_id),
                    judul: modul.judul,
                    kategori: modul.kategori,
                    sub_kategori: modul.sub_kategori,
                    deskripsi: modul.deskripsi,
                    file_path: modul.file_path,
                    hits: modul.hits,
                    uploader: modul.uploader,
                    uploader_id: modul.uploader_id
                      ? String(modul.uploader_id)
                      : null,
                    tanggal_upload: modul.tanggal_upload
                      ? new Date(modul.tanggal_upload)
                      : null,
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-surface-page min-h-screen">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <PageTitle
          title={`Kategori: ${kategoriNama}`}
          backgroundImage="/title.png"
        />
      </div>
      <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="mb-8">
          <Link href="/ruangbaca" legacyBehavior>
            <a className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-hover font-semibold transition-colors">
              <ArrowLeft size={20} />
              Kembali ke Semua Kategori
            </a>
          </Link>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
