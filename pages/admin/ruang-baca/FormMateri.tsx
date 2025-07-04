// components/Admin/RuangBaca/FormMateri.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { LoaderCircle } from "lucide-react";

interface MateriFormData {
  judul: string;
  kategori: string;
  sub_kategori: string;
  deskripsi: string;
  file?: FileList;
}

// DAFTAR KATEGORI UNTUK DROPDOWN
const kategoriOptions = [
  "Akuntabilitas Kinerja",
  "Asistensi Teknis",
  "Diseminasi Statistik",
  "Dokumentasi Paparan",
  "Leadership & Manajemen",
  "Metodologi Sensus & Survei",
  "Monitoring & Evaluasi",
  "Pembinaan Statistik",
  "Reformasi Birokrasi",
  "Regulasi",
  "Seminar & Workshop",
  "Standar Biaya",
];

const FormMateri: React.FC<{ materialId?: string }> = ({ materialId }) => {
  const router = useRouter();
  const isEditMode = !!materialId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MateriFormData>();

  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/ruangbaca/materials/${materialId}`)
        .then((res) => {
          if (!res.ok)
            throw new Error("Gagal memuat data materi untuk diedit.");
          return res.json();
        })
        .then((data) => {
          reset(data); // reset akan mengisi semua field yang cocok
        })
        .catch((error) => {
          alert((error as Error).message);
          router.push("/admin/ruang-baca");
        });
    }
  }, [isEditMode, materialId, reset, router]);

  const onSubmit = async (data: MateriFormData) => {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("kategori", data.kategori);
    formData.append("sub_kategori", data.sub_kategori);
    formData.append("deskripsi", data.deskripsi);

    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    const endpoint = isEditMode
      ? `/api/ruangbaca/materials/${materialId}`
      : "/api/ruangbaca/materials";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, { method, body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan data.");
      }
      alert(`Materi berhasil ${isEditMode ? "diperbarui" : "disimpan"}!`);
      router.push("/admin/ruang-baca");
    } catch (error) {
      alert(`Terjadi kesalahan: ${(error as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Judul Materi */}
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
        {/* --- PERUBAHAN: DARI INPUT TEKS MENJADI DROPDOWN --- */}
        <div>
          <label
            htmlFor="kategori"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Kategori
          </label>
          <select
            id="kategori"
            {...register("kategori", { required: "Kategori wajib dipilih" })}
            className="w-full border border-ui-border-input bg-surface-input rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            <option value="">-- Pilih Kategori --</option>
            {kategoriOptions.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
          {errors.kategori && (
            <p className="text-sm text-status-red mt-1">
              {errors.kategori.message}
            </p>
          )}
        </div>
        {/* ---------------------------------------------------- */}
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
            {...register("sub_kategori")}
            className="w-full border border-ui-border-input bg-surface-input rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            placeholder="Contoh: Metadata Statistik"
          />
        </div>
      </div>

      {/* Deskripsi */}
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

      {/* File Upload */}
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
        {isEditMode && (
          <p className="text-xs text-text-secondary mt-1">
            Kosongkan jika tidak ingin mengganti file yang sudah ada.
          </p>
        )}
      </div>

      {/* Tombol Aksi */}
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
