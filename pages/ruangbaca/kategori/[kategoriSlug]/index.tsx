// pages/ruangbaca/kategori/[kategoriSlug]/index.tsx

// Tidak perlu "use client" di sini untuk Pages Router
import { useState, useEffect, useMemo } from "react";
// --- PERBAIKAN KUNCI: Gunakan useRouter, bukan useParams ---
import { useRouter } from "next/router";
import Link from "next/link";
import MateriCard from "@/components/Baca/MateriCard";
import PageTitle from "@/components/ui/PageTitle";
import { LoaderCircle, AlertTriangle, ArrowLeft } from "lucide-react";

// Tipe data ApiMaterial (tetap sama)
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
  // --- PERBAIKAN KUNCI: Gunakan useRouter untuk mendapatkan slug ---
  const router = useRouter();
  const { kategoriSlug } = router.query;

  const kategoriNama = useMemo(() => {
    return kategoriSlug && typeof kategoriSlug === "string"
      ? decodeURIComponent(kategoriSlug)
      : "";
  }, [kategoriSlug]);

  const [materials, setMaterials] = useState<ApiMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Pastikan kategoriNama sudah ada sebelum fetch
    if (!kategoriNama) return;

    const fetchMaterials = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        // --- PERBAIKAN KUNCI: URL API disesuaikan ---
        const response = await fetch(
          `/api/ruangbaca/materials?kategori=${encodeURIComponent(
            kategoriNama
          )}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data materi untuk kategori ini");
        }

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
  }, [kategoriNama]); // Dependency sudah benar

  // Logika grouping (tetap sama)
  const groupedBySubKategori = useMemo(() => {
    const groups: { [key: string]: ApiMaterial[] } = {};
    materials.forEach((material) => {
      const subKategori = material.sub_kategori || "Lainnya";
      if (!groups[subKategori]) groups[subKategori] = [];
      groups[subKategori].push(material);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [materials]);

  // Logika render (tetap sama, sudah bagus)
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20">
          <LoaderCircle className="mx-auto h-12 w-12 text-brand-primary animate-spin" />
          <p className="mt-4">{`Memuat materi untuk kategori "${kategoriNama}"...`}</p>
        </div>
      );
    }
    if (hasError) {
      return (
        <div className="text-center py-20 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 font-semibold text-red-700">Terjadi kesalahan</p>
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
                    ...modul,
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
        <div className="relative z-10 max-w-screen-md mx-auto px-4 text-center">
          <PageTitle
            title={`Kategori: ${kategoriNama}`}
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
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
