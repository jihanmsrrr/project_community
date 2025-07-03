// components/Admin/RuangBaca/FormMateri.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

interface MateriFormData {
  judul: string;
  kategori: string;
  sub_kategori: string;
  deskripsi: string;
  file?: FileList;
}

const FormMateri: React.FC<{ materialId?: string }> = ({ materialId }) => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const isEditMode = !!materialId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MateriFormData>();

  // Ambil data untuk mode edit
  useEffect(() => {
    if (isEditMode) {
      // fetch(`/api/ruang-baca/manage?id=${materialId}`).then(res => res.json()).then(data => {
      //   reset(data); // Pre-fill form
      // });
    }
  }, [isEditMode, materialId, reset]);
  const onSubmit = async (data: MateriFormData) => {
    // --- PERBAIKAN DI SINI ---
    // 1. Tambahkan pengecekan untuk memastikan currentUser ada
    if (!currentUser || !currentUser.user_id) {
      alert(
        "Sesi Anda tidak valid atau telah berakhir. Silakan login kembali."
      );
      router.push("/login");
      return; // Hentikan eksekusi jika tidak ada user
    }

    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("kategori", data.kategori);

    formData.append("sub_kategori", data.sub_kategori);
    formData.append("deskripsi", data.deskripsi);
    formData.append("uploader_id", currentUser.user_id.toString());
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    try {
      const endpoint = isEditMode
        ? `/api/ruang-baca/manage?id=${materialId}`
        : "/api/ruang-baca/manage";
      const method = isEditMode ? "PATCH" : "POST";
      const response = await fetch(endpoint, { method, body: formData });

      if (!response.ok)
        throw new Error((await response.json()).message || "Gagal menyimpan.");

      alert(`Materi berhasil ${isEditMode ? "diperbarui" : "disimpan"}!`);
      router.push("/admin/ruang-baca");
    } catch (error) {
      alert(`Terjadi kesalahan: ${(error as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="judul"
          className="block text-sm font-medium text-text-secondary mb-1"
        >
          Judul Materi
        </label>
        <input
          type="text"
          id="judul"
          {...register("judul", { required: "Judul wajib diisi" })}
          className="w-full border border-ui-border-input bg-surface-input rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
        {errors.judul && (
          <p className="text-sm text-status-red mt-1">{errors.judul.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="kategori"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Kategori
          </label>
          <input
            type="text"
            id="kategori"
            {...register("kategori", { required: "Kategori wajib diisi" })}
            className="w-full border border-ui-border-input bg-surface-input rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            placeholder="Contoh: Pembinaan Statistik"
          />
          {errors.kategori && (
            <p className="text-sm text-status-red mt-1">
              {errors.kategori.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="sub_kategori"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Sub-Kategori / Topik
          </label>
          <input
            type="text"
            id="sub_kategori"
            {...register("sub_kategori", {
              required: "Sub-kategori wajib diisi",
            })}
            className="w-full border border-ui-border-input bg-surface-input rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            placeholder="Contoh: Topik 1"
          />
          {errors.sub_kategori && (
            <p className="text-sm text-status-red mt-1">
              {errors.sub_kategori.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="deskripsi"
          className="block text-sm font-medium text-text-secondary mb-1"
        >
          Deskripsi Singkat
        </label>
        <textarea
          id="deskripsi"
          rows={4}
          {...register("deskripsi")}
          className="w-full border border-ui-border-input bg-surface-input rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
      </div>
      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-text-secondary mb-1"
        >
          {isEditMode ? "Ganti File (Opsional)" : "Upload File Materi"}
        </label>
        <input
          type="file"
          id="file"
          {...register("file", { required: !isEditMode })}
          className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
        />
        {errors.file && (
          <p className="text-sm text-status-red mt-1">{errors.file.message}</p>
        )}
      </div>
      <div className="flex justify-end pt-4 border-t border-ui-border">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover font-semibold py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting && <LoaderCircle className="animate-spin" size={18} />}
          {isEditMode ? "Perbarui Materi" : "Simpan Materi"}
        </button>
      </div>
    </form>
  );
};

export default FormMateri;
