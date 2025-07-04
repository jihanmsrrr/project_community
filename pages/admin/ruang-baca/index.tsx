// pages/admin/ruang-baca.tsx
"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactElement,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  BookOpen,
  FileText,
  Download,
  LoaderCircle,
} from "lucide-react";
import type { NextPageWithLayout } from "@/pages/_app";
import AdminLayout from "@/components/ui/AdminLayout";
import { reading_materials } from "@prisma/client";

// Tipe data yang sudah disesuaikan dengan respons API (ID sebagai string)
type MateriDenganUploader = Omit<
  reading_materials,
  "material_id" | "uploader_id"
> & {
  material_id: string;
  uploader_id: string | null;
  uploader?: { nama_lengkap: string | null } | null;
  bacaUrl?: string;
};

// --- KOMPONEN LOKAL: KARTU REKAP & TABEL ---
interface RekapCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}
const RekapCard: React.FC<RekapCardProps> = ({
  title,
  value,
  icon,
  colorClass,
}) => (
  <div
    className={`bg-surface-card p-4 rounded-lg shadow-sm border-l-4 ${colorClass}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary">
          {value.toLocaleString("id-ID")}
        </p>
      </div>
      <div className="text-text-secondary/50">{icon}</div>
    </div>
  </div>
);

interface MateriTableProps {
  data: MateriDenganUploader[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
const MateriTable: React.FC<MateriTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-surface-card divide-y divide-ui-border">
      <thead className="bg-surface-page">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Judul Materi
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Kategori
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Pengunggah
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Hits
          </th>
          <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-ui-border">
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.material_id} className="hover:bg-surface-hover">
              <td className="px-4 py-3 whitespace-normal text-sm font-medium text-text-primary max-w-sm">
                {item.judul}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                {item.kategori}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                {item.uploader?.nama_lengkap || "N/A"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                {item.hits.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => onEdit(item.material_id)}
                    title="Edit Materi"
                    className="p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-full transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <a
                    href={item.bacaUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Lihat Materi"
                    className="p-2 text-text-secondary hover:text-status-blue hover:bg-status-blue/10 rounded-full transition-colors"
                  >
                    <BookOpen size={16} />
                  </a>
                  <button
                    onClick={() => onDelete(item.material_id)}
                    title="Hapus Materi"
                    className="p-2 text-text-secondary hover:text-status-red hover:bg-status-red/10 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={5}
              className="text-center py-10 text-text-secondary italic"
            >
              Tidak ada materi yang cocok dengan filter ini.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// === KOMPONEN UTAMA HALAMAN ===
const AdminRuangBacaPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [materiList, setMateriList] = useState<MateriDenganUploader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKategori, setActiveKategori] = useState<string>("all");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ruangbaca/materials");
      if (!response.ok) throw new Error("Gagal mengambil data materi.");
      const data: MateriDenganUploader[] = await response.json();
      setMateriList(data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kategoriOptions = useMemo(() => {
    const allKategori = materiList.map((item) => item.kategori).filter(Boolean);
    return ["all", ...Array.from(new Set(allKategori as string[]))];
  }, [materiList]);

  const filteredMateri = useMemo(() => {
    let data = [...materiList];
    if (activeKategori !== "all") {
      data = data.filter((item) => item.kategori === activeKategori);
    }
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      data = data.filter((item) =>
        item.judul?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return data;
  }, [materiList, activeKategori, searchTerm]);

  const handleEdit = (id: string) => {
    router.push(`/admin/ruang-baca/tambah?id=${id}`);
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        window.confirm(
          "Apakah Anda yakin ingin menghapus materi ini? Aksi ini tidak bisa dibatalkan."
        )
      ) {
        try {
          const response = await fetch(`/api/ruangbaca/materials/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Gagal menghapus materi.");
          alert("Materi berhasil dihapus.");
          fetchData();
        } catch (error) {
          console.error(error);
          alert((error as Error).message);
        }
      }
    },
    [fetchData]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderCircle className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Manajemen Ruang Baca
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Kelola semua materi, modul, dan panduan yang tersedia.
          </p>
        </div>
        <Link href="/admin/ruang-baca/tambah" legacyBehavior>
          <a className="w-full sm:w-auto bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
            <PlusCircle size={18} /> Tambah Materi Baru
          </a>
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Rekap Materi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RekapCard
            title="Total Materi"
            value={materiList.length}
            icon={<BookOpen size={28} />}
            colorClass="border-status-blue text-status-blue"
          />
          <RekapCard
            title="Total Kategori"
            value={kategoriOptions.length - 1}
            icon={<FileText size={28} />}
            colorClass="border-status-green text-status-green"
          />
          <RekapCard
            title="Total Hits/Dilihat"
            value={materiList.reduce((acc, item) => acc + item.hits, 0)}
            icon={<Download size={28} />}
            colorClass="border-status-orange text-status-orange"
          />
        </div>
      </section>

      <div className="bg-surface-card p-4 sm:p-6 rounded-xl shadow-md">
        <div className="border-b border-ui-border mb-4">
          <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto">
            {kategoriOptions.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setActiveKategori(kategori)}
                className={`whitespace-nowrap capitalize pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeKategori === kategori
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-ui-border"
                }`}
              >
                {kategori === "all"
                  ? "Semua Kategori"
                  : kategori.replace(/-/g, " ")}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex justify-end mb-4">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="search"
              placeholder="Cari materi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-ui-border-input rounded-lg bg-surface-input text-sm focus:ring-1 focus:ring-brand-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-placeholder" />
          </div>
        </div>
        <MateriTable
          data={filteredMateri}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

AdminRuangBacaPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminRuangBacaPage;
