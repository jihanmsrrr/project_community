// pages/admin/varia-statistik.tsx
"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactElement,
} from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Clock,
  CheckCircle,
  FileWarning,
  FolderClock,
  Edit,
  Trash2,
  Send,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";

import type { NextPageWithLayout } from "../_app";
import AdminLayout from "@/components/ui/AdminLayout";
import RekapCard from "@/components/Admin/Berita/RekapCard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// --- Tipe Data ---
// DIPERBARUI: Tambahkan field opsional untuk data lengkap
interface ArtikelBerita {
  news_id: string;
  judul: string;
  abstrak: string;
  kategori: string;
  updatedAt: string;
  status: "pending_review" | "published" | "revision" | "draft";
  penulis: {
    nama_lengkap: string | null;
  } | null;
  // Field untuk data lengkap (opsional)
  isi_berita?: string;
  gambar?: string;
}
type BeritaStatus = Exclude<ArtikelBerita["status"], "draft">;

// --- Komponen-komponen UI ---

const BeritaTable: React.FC<{
  data: ArtikelBerita[];
  onEdit: (id: string) => void; // Hanya perlu ID untuk memulai proses edit
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: BeritaStatus) => void;
  isLoading: boolean;
}> = ({ data, onEdit, onDelete, onUpdateStatus, isLoading }) => {
  // ... (Isi komponen BeritaTable tetap sama, hanya prop onEdit yang berubah)
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center p-4 bg-gray-100 rounded-lg animate-pulse dark:bg-gray-800"
          >
            <div className="h-5 w-2/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="ml-auto h-5 w-1/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="ml-4 h-5 w-1/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }
  if (data.length === 0)
    return (
      <p className="text-center text-text-secondary py-8">
        Tidak ada berita yang cocok dengan filter ini.
      </p>
    );
  const getStatusBadge = (status: BeritaStatus) => {
    switch (status) {
      case "pending_review":
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
            <Clock size={14} /> Menunggu
          </span>
        );
      case "published":
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle size={14} /> Tayang
          </span>
        );
      case "revision":
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
            <FileWarning size={14} /> Revisi
          </span>
        );
      default:
        return null;
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-secondary uppercase bg-surface-page">
          <tr>
            <th className="px-6 py-3">Judul</th>
            <th className="px-6 py-3">Penulis</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Terakhir Diubah</th>
            <th className="px-6 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.news_id}
              className="bg-surface-card border-b border-ui-border hover:bg-surface-hover"
            >
              <td className="px-6 py-4 font-medium text-text-primary">
                {item.judul}
              </td>
              <td className="px-6 py-4 text-text-secondary">
                {item.penulis?.nama_lengkap || "N/A"}
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(item.status as BeritaStatus)}
              </td>
              <td className="px-6 py-4 text-text-secondary">
                {new Date(item.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end items-center gap-2">
                  {item.status !== "published" && (
                    <button
                      onClick={() => onUpdateStatus(item.news_id, "published")}
                      title="Setujui & Publikasikan"
                      className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                    >
                      <Send size={16} />
                    </button>
                  )}
                  {item.status !== "revision" && (
                    <button
                      onClick={() => onUpdateStatus(item.news_id, "revision")}
                      title="Minta Revisi"
                      className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-md"
                    >
                      <FileWarning size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(item.news_id)}
                    title="Edit"
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.news_id)}
                    title="Hapus"
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ConfirmationDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md p-0">
      <div className="p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-text-primary">
          {title}
        </h3>
        <p className="mt-2 text-sm text-text-secondary">{message}</p>
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 bg-surface-page/50 rounded-b-xl border-t border-ui-border/50">
        <DialogClose asChild>
          <button
            type="button"
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-ui-border/50 text-text-secondary hover:bg-ui-border/80 font-semibold disabled:opacity-50"
          >
            Batal
          </button>
        </DialogClose>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          {isDeleting && <Loader2 className="animate-spin" size={16} />}Ya,
          Hapus
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

// DIPERBARUI: Edit dialog sekarang bisa menangani semua field
const EditBeritaDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  berita: ArtikelBerita | null;
  onSave: (id: string, updatedData: Partial<ArtikelBerita>) => Promise<void>;
  isFetchingDetails: boolean;
}> = ({ isOpen, onClose, berita, onSave, isFetchingDetails }) => {
  const [formData, setFormData] = useState<Partial<ArtikelBerita>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (berita) {
      setFormData({
        judul: berita.judul,
        abstrak: berita.abstrak,
        kategori: berita.kategori,
        status: berita.status,
        isi_berita: berita.isi_berita || "",
        gambar: berita.gambar || "",
      });
    } else {
      setFormData({});
    }
  }, [berita]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!berita) return;
    setIsSaving(true);
    try {
      await onSave(berita.news_id, formData);
      onClose();
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0">
        <div className="flex flex-col max-h-[90vh]">
          <div className="flex-shrink-0 p-6 border-b border-ui-border flex justify-between items-center">
            <DialogTitle>Edit Artikel Berita</DialogTitle>
            <DialogClose asChild>
              <button className="p-1 rounded-full text-text-secondary hover:bg-ui-border">
                <X size={20} />
              </button>
            </DialogClose>
          </div>
          {isFetchingDetails ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <>
              <form
                id="edit-berita-form"
                onSubmit={handleSubmit}
                className="flex-grow overflow-y-auto p-6 space-y-4"
              >
                <div>
                  <label
                    htmlFor="judul"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Judul
                  </label>
                  <input
                    id="judul"
                    name="judul"
                    value={formData.judul || ""}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="abstrak"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Abstrak
                  </label>
                  <textarea
                    id="abstrak"
                    name="abstrak"
                    value={formData.abstrak || ""}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="isi_berita"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Isi Berita
                  </label>
                  <textarea
                    id="isi_berita"
                    name="isi_berita"
                    value={formData.isi_berita || ""}
                    onChange={handleChange}
                    rows={10}
                    className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="kategori"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Kategori
                  </label>
                  <input
                    id="kategori"
                    name="kategori"
                    value={formData.kategori || ""}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gambar"
                    className="text-sm font-medium text-text-secondary"
                  >
                    URL Gambar
                  </label>
                  <input
                    id="gambar"
                    name="gambar"
                    value={formData.gambar || ""}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  >
                    <option value="pending_review">Menunggu Review</option>
                    <option value="published">Tayang (Published)</option>
                    <option value="revision">Perlu Revisi</option>
                  </select>
                </div>
              </form>
              <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-ui-border">
                <DialogClose asChild>
                  <button
                    type="button"
                    disabled={isSaving}
                    className="px-4 py-2 rounded-lg bg-ui-border/50 text-text-secondary hover:bg-ui-border/80 font-semibold disabled:opacity-50"
                  >
                    Batal
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  form="edit-berita-form"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="animate-spin" size={16} />}
                  Simpan Perubahan
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Komponen Halaman Utama ---
const AdminVariaStatistikPage: NextPageWithLayout = () => {
  const [activeTab, setActiveTab] = useState<BeritaStatus | "all">(
    "pending_review"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [beritaList, setBeritaList] = useState<ArtikelBerita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // State untuk dialog edit
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [editingBerita, setEditingBerita] = useState<ArtikelBerita | null>(
    null
  );

  const fetchBeritaList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/berita"); // Ini akan mengambil daftar
      if (!response.ok) throw new Error("Gagal mengambil daftar berita");
      const data: ArtikelBerita[] = await response.json();
      setBeritaList(data.filter((item) => item.status !== "draft"));
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
      setBeritaList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBeritaList();
  }, [fetchBeritaList]);

  const rekapData = useMemo(
    () => ({
      pending: beritaList.filter((p) => p.status === "pending_review").length,
      published: beritaList.filter((p) => p.status === "published").length,
      revision: beritaList.filter((p) => p.status === "revision").length,
    }),
    [beritaList]
  );

  const filteredBerita = useMemo(() => {
    let data = beritaList;
    if (activeTab !== "all")
      data = data.filter((item) => item.status === activeTab);
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.judul.toLowerCase().includes(lowerSearchTerm) ||
          item.penulis?.nama_lengkap?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return data;
  }, [activeTab, searchTerm, beritaList]);

  // --- Handlers ---

  // DIPERBARUI: Handler untuk memulai proses edit
  const handleEdit = async (id: string) => {
    setIsEditDialogOpen(true);
    setIsFetchingDetails(true);
    setEditingBerita(null); // Kosongkan data lama
    try {
      const response = await fetch(`/api/admin/berita?id=${id}`); // Ambil data lengkap
      if (!response.ok) throw new Error("Gagal mengambil detail berita");
      const dataLengkap: ArtikelBerita = await response.json();
      setEditingBerita(dataLengkap);
    } catch (error) {
      console.error("Error fetching details:", error);
      setIsEditDialogOpen(false); // Tutup dialog jika gagal
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleUpdate = async (
    id: string,
    dataToUpdate: Partial<ArtikelBerita>
  ) => {
    try {
      const response = await fetch("/api/admin/berita", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...dataToUpdate }),
      });
      if (!response.ok) throw new Error("Gagal memperbarui berita");
      await fetchBeritaList(); // Refresh daftar setelah update
    } catch (error) {
      console.error("Error during update:", error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      await fetch("/api/admin/berita", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: confirmDeleteId }),
      });
      setConfirmDeleteId(null);
      await fetchBeritaList();
    } catch (error) {
      console.error("Error during delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const tabItems: { label: string; status: BeritaStatus | "all" }[] = [
    { label: "Menunggu Review", status: "pending_review" },
    { label: "Sudah Tayang", status: "published" },
    { label: "Perlu Revisi", status: "revision" },
    { label: "Semua Berita", status: "all" },
  ];

  return (
    <>
      <ConfirmationDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus artikel ini secara permanen? Tindakan ini tidak dapat diurungkan."
        isDeleting={isDeleting}
      />
      <EditBeritaDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        berita={editingBerita}
        onSave={handleUpdate}
        isFetchingDetails={isFetchingDetails}
      />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Manajemen Varia Statistik
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Kelola, review, dan publikasikan artikel yang dikirim oleh
              pengguna.
            </p>
          </div>
          <Link href="/varia-statistik/tambahberita" legacyBehavior>
            <a className="bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
              <PlusCircle size={18} /> Tambah Artikel
            </a>
          </Link>
        </div>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Rekap Berita
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <RekapCard
              title="Menunggu Review"
              value={rekapData.pending}
              icon={<Clock />}
              colorClass="border-yellow-500 text-yellow-600"
            />
            <RekapCard
              title="Sudah Tayang"
              value={rekapData.published}
              icon={<CheckCircle />}
              colorClass="border-green-500 text-green-600"
            />
            <RekapCard
              title="Perlu Revisi"
              value={rekapData.revision}
              icon={<FileWarning />}
              colorClass="border-red-500 text-red-600"
            />
            <RekapCard
              title="Total Artikel"
              value={beritaList.length}
              icon={<FolderClock />}
              colorClass="border-gray-400 text-gray-500"
            />
          </div>
        </section>
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
            onDelete={setConfirmDeleteId}
            onUpdateStatus={(id, status) => handleUpdate(id, { status })}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

AdminVariaStatistikPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminVariaStatistikPage;
