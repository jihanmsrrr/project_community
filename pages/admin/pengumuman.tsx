"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import Image from "next/image";
import AdminLayout from "@/components/ui/AdminLayout";

// DIIMPOR: Menggunakan komponen Dialog dari UI library Anda
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// --- Tipe Data ---
interface Pengumuman {
  id: number;
  judul: string;
  gambarUrl: string;
  isiPengumuman: string;
  targetUrl: string;
  tanggalMulai: string;
  tanggalBerakhir: string;
  aktif: boolean;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// --- Komponen Dialog Konfirmasi ---
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-feedback-error-bg">
            <AlertTriangle className="h-6 w-6 text-feedback-error-text" />
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
              className="px-4 py-2 rounded-lg bg-ui-border/50 text-text-secondary hover:bg-ui-border/80 transition-colors font-semibold"
            >
              Batal
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Komponen Halaman Utama ---
const PengumumanPage = () => {
  const [data, setData] = useState<Pengumuman[]>([]);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Partial<Pengumuman>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Omit<
    ConfirmationDialogProps,
    "isOpen"
  > | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/pengumuman?all=true");
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
        console.error("Ukuran gambar maksimal 1MB");
        return;
      }
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({});
    setImageFile(null);
    setPreviewImage(null);
    setShowFormDialog(false);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul || !form.tanggalMulai || !form.tanggalBerakhir) {
      console.error("Judul dan tanggal wajib diisi");
      return;
    }

    const isEdit = isEditing && form.id;
    const method = isEdit ? "PUT" : "POST";
    const formData = new FormData();

    formData.append("judul", form.judul);
    formData.append("isiPengumuman", form.isiPengumuman || "");
    formData.append("targetUrl", form.targetUrl || "");
    formData.append("tanggalMulai", form.tanggalMulai);
    formData.append("tanggalBerakhir", form.tanggalBerakhir);
    formData.append("aktif", String(form.aktif || false));

    if (isEdit) formData.append("id", String(form.id));
    if (imageFile) {
      formData.append("gambar", imageFile);
    } else if (isEdit && form.gambarUrl) {
      formData.append("gambarUrl", form.gambarUrl);
    }

    try {
      const response = await fetch("/api/pengumuman", {
        method,
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        fetchData();
        resetForm();
      } else {
        console.error("Error response:", result);
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const performDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/pengumuman?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        setConfirmation(null);
      }
    } catch (error) {
      console.error("Gagal menghapus pengumuman", error);
      setConfirmation(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setConfirmation({
      title: "Konfirmasi Hapus",
      message:
        "Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat diurungkan.",
      onConfirm: () => performDelete(id),
      onCancel: () => setConfirmation(null),
    });
  };

  const handleEditClick = (item: Pengumuman) => {
    const formattedItem = {
      ...item,
      tanggalMulai: new Date(item.tanggalMulai).toISOString().split("T")[0],
      tanggalBerakhir: new Date(item.tanggalBerakhir)
        .toISOString()
        .split("T")[0],
    };
    setForm(formattedItem);
    setPreviewImage(item.gambarUrl);
    setIsEditing(true);
    setShowFormDialog(true);
  };

  const filteredData = data.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold text-text-primary">
            Manajemen Pengumuman
          </h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-surface-card border border-ui-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
            />
            <button
              onClick={() => {
                resetForm();
                setForm({ aktif: true });
                setShowFormDialog(true);
                setIsEditing(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover transition-colors font-semibold"
            >
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-ui-border/50 bg-surface-card">
          <table className="w-full text-left">
            <thead className="border-b border-ui-border/50">
              <tr>
                <th className="p-4 text-sm font-semibold text-text-secondary">
                  Judul
                </th>
                <th className="p-4 text-sm font-semibold text-text-secondary">
                  Gambar
                </th>
                <th className="p-4 text-sm font-semibold text-text-secondary">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-text-secondary">
                  Mulai
                </th>
                <th className="p-4 text-sm font-semibold text-text-secondary">
                  Berakhir
                </th>
                <th className="p-4 text-sm font-semibold text-text-secondary">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-ui-border/50 hover:bg-surface-page transition-colors"
                >
                  <td className="p-4 text-text-primary font-medium">
                    {item.judul}
                  </td>
                  <td className="p-4">
                    <Image
                      src={item.gambarUrl || "/placeholder.png"}
                      alt={item.judul}
                      width={96}
                      height={56}
                      className="rounded-md object-cover"
                    />
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        item.aktif
                          ? "bg-status-green/20 text-green-700 dark:text-green-300"
                          : "bg-feedback-error-bg text-feedback-error-text"
                      }`}
                    >
                      {item.aktif ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {new Date(item.tanggalMulai).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4 text-text-secondary">
                    {new Date(item.tanggalBerakhir).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 rounded-md text-text-secondary hover:bg-ui-border hover:text-text-primary transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="p-2 rounded-md text-feedback-error-text hover:bg-feedback-error-bg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOG KONFIRMASI */}
      <ConfirmationDialog
        isOpen={!!confirmation}
        title={confirmation?.title || "Konfirmasi"}
        message={confirmation?.message || ""}
        onConfirm={() => confirmation?.onConfirm()}
        onCancel={() => confirmation?.onCancel()}
      />

      {/* DIALOG FORM BARU (DENGAN KONTEN SCROLLABLE) */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="sm:max-w-2xl p-0">
          <div className="flex flex-col max-h-[90vh]">
            <div className="flex-shrink-0 p-6 border-b border-ui-border/50">
              <DialogTitle>
                {isEditing ? "Edit" : "Tambah"} Pengumuman
              </DialogTitle>
              <DialogClose asChild>
                <button className="absolute top-4 right-4 p-1 rounded-full text-text-secondary hover:bg-ui-border transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </DialogClose>
            </div>

            <form
              id="pengumuman-form"
              className="flex-grow overflow-y-auto space-y-4 p-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  Judul
                </label>
                <input
                  name="judul"
                  value={form.judul || ""}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  Gambar (Max 1MB)
                </label>
                <input
                  type="file"
                  name="gambar"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                />
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  Isi Pengumuman
                </label>
                <textarea
                  name="isiPengumuman"
                  value={form.isiPengumuman || ""}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg h-24 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  Target URL
                </label>
                <input
                  name="targetUrl"
                  value={form.targetUrl || ""}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    name="tanggalMulai"
                    value={form.tanggalMulai || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Tanggal Berakhir
                  </label>
                  <input
                    type="date"
                    name="tanggalBerakhir"
                    value={form.tanggalBerakhir || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-ui-border-input bg-surface-page rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                    required
                  />
                </div>
              </div>
              {/* DIPERBAIKI: Struktur HTML untuk Toggle Switch */}
              <div className="flex items-center justify-between bg-surface-page p-3 rounded-lg border border-ui-border-input">
                <span className="font-medium text-text-secondary">Status</span>
                <label
                  htmlFor="aktif"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="aktif"
                    name="aktif"
                    className="sr-only peer"
                    checked={form.aktif || false}
                    onChange={(e) =>
                      setForm({ ...form, aktif: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-ui-border rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  <span className="ml-3 text-sm font-semibold text-text-primary">
                    {form.aktif ? "Aktif" : "Tidak Aktif"}
                  </span>
                </label>
              </div>
            </form>
            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-ui-border/50">
              <DialogClose asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-ui-border/50 text-text-secondary hover:bg-ui-border/80 transition-colors font-semibold"
                >
                  Batal
                </button>
              </DialogClose>
              <button
                type="submit"
                form="pengumuman-form"
                className="px-4 py-2 rounded-lg bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover transition-colors font-semibold"
              >
                {isEditing ? "Perbarui" : "Simpan"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Fungsi ini digunakan oleh Next.js untuk membungkus halaman dengan layout yang ditentukan.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(PengumumanPage as any).getLayout = function getLayout(
  page: React.ReactElement
) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default PengumumanPage;
