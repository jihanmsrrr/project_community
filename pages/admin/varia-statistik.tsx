// /pages/admin/varia-statistik.tsx
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
  Clock,
  CheckCircle,
  FileWarning,
  ImageIcon,
  FolderClock,
} from "lucide-react";

// Impor komponen dan tipe data
import type { NextPageWithLayout } from "../_app";
import AdminLayout from "@/components/ui/AdminLayout";
import BeritaTable from "@/components/Admin/Berita/BeritaTable";
import type { ArtikelBerita } from "@/types/varia"; // Asumsi tipe ini sudah diperbarui atau akan diperbarui
import RekapCard from "@/components/Admin/Berita/RekapCard";

// === START: Tambahkan import 'BigInt' untuk tipe ID dari Prisma ===
// Jika Anda tidak menggunakan BigInt secara global, Anda bisa mengimpornya.
// Tapi karena BigInt adalah tipe bawaan JS, tidak perlu import khusus.
// Kita hanya perlu pastikan TypeScript memahami bahwa ini adalah BigInt.
// === END: Tambahkan import 'BigInt' ===

// Tipe status berita yang dikelola di halaman ini (tanpa 'draft')
type BeritaStatus = Exclude<ArtikelBerita["status"], "draft">;

// === KOMPONEN UTAMA HALAMAN MANAJEMEN ===
const AdminVariaStatistikPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<BeritaStatus | "all">(
    "pending_review"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [beritaList, setBeritaList] = useState<ArtikelBerita[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Memanggil API yang diasumsikan sudah disiapkan untuk admin
        const response = await fetch("/api/berita");
        if (!response.ok) throw new Error("Gagal mengambil data");

        const data: ArtikelBerita[] = await response.json();
        // Langsung set data, asumsi API sudah memfilter status 'draft'
        setBeritaList(data);
      } catch (error) {
        console.error("Gagal mengambil data berita:", error);
        setBeritaList([]); // Set ke array kosong jika gagal
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Kalkulasi untuk Rekap Berita (menggunakan sintaks ringkas)
  const rekapData = useMemo(
    () => ({
      pending: beritaList.filter((p) => p.status === "pending_review").length,
      published: beritaList.filter((p) => p.status === "published").length,
      revision: beritaList.filter((p) => p.status === "revision").length,
    }),
    [beritaList]
  );

  // Logika filter untuk tabel
  const filteredBerita = useMemo(() => {
    let data = beritaList;

    // 1. Filter berdasarkan tab aktif
    if (activeTab !== "all") {
      data = data.filter((item) => item.status === activeTab);
    }

    // 2. Filter berdasarkan kata kunci pencarian
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          // PERBAIKAN: Gunakan 'nama_penulis' sesuai skema Prisma
          item.judul.toLowerCase().includes(lowerSearchTerm) ||
          (item.nama_penulis &&
            item.nama_penulis.toLowerCase().includes(lowerSearchTerm)) // Tambahkan cek nullish
      );
    }

    // Urutkan berdasarkan tanggal terbaru
    // PERBAIKAN: Gunakan .getTime() untuk mengurutkan objek Date
    return data.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());
  }, [activeTab, searchTerm, beritaList]);

  // PERBAIKAN: Ubah tipe ID menjadi BigInt
  const handleEdit = (id: bigint) => {
    // Karena URL query biasanya string atau number, Anda mungkin perlu konversi BigInt ke string
    router.push(`/admin/varia-statistik/edit?id=${id.toString()}`);
  };

  // PERBAIKAN: Ubah tipe ID menjadi BigInt
  const handleDelete = useCallback(async (id: bigint) => {
    console.log("Hapus artikel dengan ID:", id.toString()); // Konversi untuk log
    // TODO: Implementasikan logika hapus artikel
    // Contoh:
    // try {
    //   const response = await fetch(`/api/berita/${id.toString()}`, {
    //     method: 'DELETE',
    //   });
    //   if (!response.ok) throw new Error('Gagal menghapus berita');
    //   // Perbarui daftar berita setelah penghapusan berhasil
    //   setBeritaList(beritaList.filter(b => b.news_id !== id));
    // } catch (error) {
    //   console.error("Error deleting berita:", error);
    // }
  }, []); // Anda mungkin perlu menambahkan 'beritaList' ke dependency array jika onDelete langsung memodifikasi state

  // PERBAIKAN: Ubah tipe ID menjadi BigInt
  const handleApprove = useCallback(async (id: bigint) => {
    console.log("Setujui artikel dengan ID:", id.toString()); // Konversi untuk log
    // TODO: Implementasikan logika setujui artikel
    // Contoh:
    // try {
    //   const response = await fetch(`/api/berita/${id.toString()}/approve`, {
    //     method: 'PUT', // Atau PATCH, tergantung API Anda
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ status: 'published' }),
    //   });
    //   if (!response.ok) throw new Error('Gagal menyetujui berita');
    //   // Perbarui daftar berita setelah persetujuan berhasil
    //   // Idealnya, fetch ulang data atau update status di state lokal
    //   const updatedList = beritaList.map(b =>
    //     b.news_id === id ? { ...b, status: 'published' } : b
    //   );
    //   setBeritaList(updatedList);
    // } catch (error) {
    //   console.error("Error approving berita:", error);
    // }
  }, []); // Anda mungkin perlu menambahkan 'beritaList' ke dependency array jika onApprove langsung memodifikasi state

  // Konfigurasi untuk item tab navigasi
  const tabItems: { label: string; status: BeritaStatus | "all" }[] = [
    { label: "Menunggu Review", status: "pending_review" },
    { label: "Sudah Tayang", status: "published" },
    { label: "Perlu Revisi", status: "revision" },
    { label: "Semua Berita", status: "all" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Manajemen Varia Statistik
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Kelola, review, dan publikasikan artikel yang dikirim oleh pengguna.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href="/admin/varia-statistik/tambah" legacyBehavior>
            <a className="w-full sm:w-auto bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
              <PlusCircle size={18} /> Tambah Artikel
            </a>
          </Link>
          <Link href="/admin/galeri-media" legacyBehavior>
            <a className="w-full sm:w-auto bg-surface-button-secondary text-text-on-button-secondary hover:bg-surface-button-secondary-hover font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 border border-ui-border">
              <ImageIcon size={18} /> Galeri Media
            </a>
          </Link>
        </div>
      </div>

      {/* 2. Section Rekap Berita */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Rekap Berita
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RekapCard
            title="Menunggu Review"
            value={rekapData.pending}
            icon={<Clock size={28} />}
            colorClass="border-status-blue text-status-blue"
          />
          <RekapCard
            title="Sudah Tayang"
            value={rekapData.published}
            icon={<CheckCircle size={28} />}
            colorClass="border-status-green text-status-green"
          />
          <RekapCard
            title="Perlu Revisi"
            value={rekapData.revision}
            icon={<FileWarning size={28} />}
            colorClass="border-status-red text-status-red"
          />
          <RekapCard
            title="Total Artikel"
            value={beritaList.length}
            icon={<FolderClock size={28} />}
            colorClass="border-gray-400 text-gray-500"
          />
        </div>
      </section>

      {/* 3. Section Tabel Manajemen */}
      <div className="bg-surface-card p-4 sm:p-6 rounded-xl shadow-md">
        <div className="border-b border-ui-border mb-4">
          <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto">
            {tabItems.map((tab) => (
              <button
                key={tab.status}
                onClick={() => setActiveTab(tab.status)}
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.status
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-ui-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex justify-end mb-4">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="search"
              placeholder="Cari judul atau penulis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-ui-border-input rounded-lg bg-surface-input text-sm focus:ring-1 focus:ring-brand-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-placeholder" />
          </div>
        </div>

        <BeritaTable
          data={filteredBerita}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Menerapkan AdminLayout ke halaman ini
AdminVariaStatistikPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminVariaStatistikPage;
