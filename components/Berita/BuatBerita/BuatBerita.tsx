// components/Berita/BuatBerita/BuatBerita.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UploadCloud, X as CloseIcon, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface FormDataType {
  judul: string;
  kategori: string;
  kataKunci: string[];
  abstrak: string;
  isiBerita: string;
  status: "draft" | "pending_review" | "published";
  gambarFiles: (File | { url: string })[];
}

const kategoriOptions = [
  "BPS Terkini",
  "Berita Daerah",
  "Serba Serbi",
  "Fotogenik",
  "Wisata",
  "Opini",
];

const BuatBerita: React.FC<{ articleId?: string }> = ({ articleId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isEditMode = !!articleId;

  const [inputKataKunci, setInputKataKunci] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataType>({
    mode: "onChange",
    defaultValues: {
      judul: "",
      kategori: "",
      kataKunci: [],
      abstrak: "",
      isiBerita: "",
      status: "draft",
      gambarFiles: [],
    },
  });

  const kataKunciValues = watch("kataKunci");
  const gambarFiles = watch("gambarFiles");

  useEffect(() => {
    if (isEditMode && articleId) {
      const fetchArticleData = async () => {
        setIsFetchingData(true);
        try {
          const response = await fetch(`/api/berita/${articleId}`);
          if (!response.ok) throw new Error("Gagal mengambil data artikel.");
          const dataToEdit = await response.json();
          reset({
            judul: dataToEdit.judul,
            kategori: dataToEdit.kategori,
            kataKunci: dataToEdit.kata_kunci || [],
            abstrak: dataToEdit.abstrak,
            isiBerita: dataToEdit.isi_berita,
            status: dataToEdit.status,
            gambarFiles: (dataToEdit.gambar_urls as { url: string }[]) || [],
          });
        } catch (error) {
          // --- PERBAIKAN: Menggunakan variabel 'error' di console.error ---
          console.error("Fetch error:", (error as Error).message);
          alert("Gagal memuat data artikel.");
          router.push("/admin/varia-statistik");
        } finally {
          setIsFetchingData(false);
        }
      };
      fetchArticleData();
    } else {
      setIsFetchingData(false);
    }
  }, [articleId, isEditMode, reset, router]);

  const addKataKunci = useCallback(
    (kata: string) => {
      kata = kata.trim().toLowerCase();
      if (
        kata &&
        !kataKunciValues.includes(kata) &&
        kataKunciValues.length < 5
      ) {
        setValue("kataKunci", [...kataKunciValues, kata], {
          shouldValidate: true,
        });
      }
      setInputKataKunci("");
    },
    [kataKunciValues, setValue]
  );

  const removeKataKunci = (kata: string) => {
    setValue(
      "kataKunci",
      kataKunciValues.filter((k) => k !== kata),
      { shouldValidate: true }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const currentFiles = getValues("gambarFiles");
    if (currentFiles.length + files.length > 5) {
      alert("Maksimal 5 gambar yang bisa diupload.");
      return;
    }
    setValue("gambarFiles", [...currentFiles, ...files], {
      shouldValidate: true,
    });
  };

  const removeGambar = (index: number) => {
    setValue(
      "gambarFiles",
      getValues("gambarFiles").filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const submitBerita = async (
    data: FormDataType,
    newStatus: FormDataType["status"]
  ) => {
    // --- PERBAIKAN: Menggunakan variabel 'session' untuk keamanan ---
    if (!session?.user?.id || !session.user.name) {
      alert(
        "Sesi Anda tidak valid atau telah berakhir. Silakan login kembali."
      );
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("kategori", data.kategori);
    formData.append("abstrak", data.abstrak);
    formData.append("isi_berita", data.isiBerita);
    formData.append("status", newStatus);
    formData.append("kata_kunci", JSON.stringify(data.kataKunci));

    data.gambarFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append("gambar", file);
      }
    });

    try {
      const endpoint = isEditMode ? `/api/berita/${articleId}` : "/api/berita";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, { method, body: formData });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Gagal menyimpan berita."
        );

      alert(`Berita berhasil disimpan sebagai "${newStatus}"!`);
      router.push(`/admin/varia-statistik`);
    } catch (error) {
      alert(`Terjadi kesalahan: ${(error as Error).message}`);
    }
  };

  const handlePreview = async () => {
    const isValidForm = await trigger();
    if (isValidForm) {
      setPreviewOpen(true);
    } else {
      alert(
        "Harap lengkapi semua kolom yang wajib diisi sebelum melihat preview."
      );
    }
  };

  if (isFetchingData) {
    return (
      <div className="text-center p-10">
        <LoaderCircle className="w-8 h-8 mx-auto animate-spin" />
      </div>
    );
  }

  return (
    <>
      <form
        className="bg-surface-card p-6 sm:p-8 rounded-xl shadow-lg space-y-8"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {/* --- PERBAIKAN: Menampilkan nama penulis dari sesi --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg bg-surface-page border border-ui-border">
          <div>
            <p className="text-xs text-text-secondary">Penulis</p>
            <p className="font-semibold text-text-primary">
              {session?.user?.name || "Memuat..."}
            </p>
          </div>
        </div>
        <div>
          <label
            htmlFor="judul"
            className="block text-sm font-bold text-text-secondary mb-2"
          >
            Judul Artikel
          </label>
          <input
            id="judul"
            {...register("judul", { required: "Judul wajib diisi" })}
            className="block w-full px-4 py-3 bg-surface-input border rounded-md shadow-sm"
          />
          {errors.judul && (
            <p className="text-status-red mt-1 text-xs">
              {errors.judul.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="kategori"
              className="block text-sm font-bold text-text-secondary mb-2"
            >
              Kategori
            </label>
            <select
              id="kategori"
              {...register("kategori", { required: "Kategori wajib dipilih" })}
              className="block w-full px-4 py-3 bg-surface-input border rounded-md shadow-sm"
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            {errors.kategori && (
              <p className="text-status-red mt-1 text-xs">
                {errors.kategori.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="kataKunciInput"
              className="block text-sm font-bold text-text-secondary mb-2"
            >
              Kata Kunci (Maksimal 5)
            </label>
            <input
              id="kataKunciInput"
              type="text"
              value={inputKataKunci}
              onChange={(e) => setInputKataKunci(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addKataKunci(inputKataKunci);
                }
              }}
              placeholder="Ketik lalu tekan Enter..."
              className="block w-full px-4 py-3 bg-surface-input border rounded-md shadow-sm"
              disabled={kataKunciValues.length >= 5}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {kataKunciValues.map((k) => (
                <div
                  key={k}
                  className="flex items-center bg-brand-primary/10 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full"
                >
                  <span>{k}</span>
                  <button
                    type="button"
                    onClick={() => removeKataKunci(k)}
                    className="ml-2 font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="abstrak"
            className="block text-sm font-bold text-text-secondary mb-2"
          >
            Abstrak
          </label>
          <textarea
            id="abstrak"
            rows={4}
            {...register("abstrak", { required: "Abstrak wajib diisi" })}
            className="block w-full px-4 py-3 bg-surface-input border rounded-md shadow-sm"
          />
          {errors.abstrak && (
            <p className="text-status-red mt-1 text-xs">
              {errors.abstrak.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-text-secondary mb-2">
            Isi Berita
          </label>
          <Controller
            name="isiBerita"
            control={control}
            rules={{ required: "Isi berita tidak boleh kosong." }}
            render={({ field }) => (
              <Editor
                apiKey="YOUR_TINYMCE_API_KEY"
                value={field.value}
                onEditorChange={field.onChange}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: "lists link image help wordcount",
                  toolbar:
                    "undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | help",
                }}
              />
            )}
          />
          {errors.isiBerita && (
            <p className="text-status-red mt-1 text-xs">
              {errors.isiBerita.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-text-secondary mb-2">
            Gambar Pendukung
          </label>
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-ui-border-input border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadCloud className="h-10 w-10 mx-auto text-text-placeholder" />
              <div className="flex text-sm text-text-secondary">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-surface-card rounded-md font-medium text-brand-primary hover:text-brand-primary-hover"
                >
                  <span>Upload file</span>
                  <input
                    id="file-upload"
                    name="gambar"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">atau drag and drop</p>
              </div>
            </div>
          </div>
          {gambarFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {gambarFiles.map((file, i) => (
                <div key={i} className="relative group aspect-square">
                  <Image
                    src={
                      file instanceof File
                        ? URL.createObjectURL(file)
                        : (file as { url: string }).url
                    }
                    alt={`Preview ${i + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeGambar(i)}
                      className="w-8 h-8 rounded-full bg-status-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <CloseIcon size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-6 border-t border-ui-border flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleSubmit((data) => submitBerita(data, "draft"))}
            disabled={isSubmitting}
            className="px-6 py-3 border border-ui-border rounded-md shadow-sm text-sm font-bold text-text-secondary bg-surface-button-secondary hover:bg-surface-button-secondary-hover"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan sebagai Draft"}
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className="px-6 py-3 border border-ui-border rounded-md shadow-sm text-sm font-bold text-text-secondary bg-surface-button-secondary hover:bg-surface-button-secondary-hover"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={handleSubmit((data) =>
              submitBerita(data, "pending_review")
            )}
            disabled={isSubmitting || !isValid}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-text-on-brand bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-primary/50"
          >
            {isSubmitting ? "Mengajukan..." : "Ajukan untuk Review"}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {previewOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start overflow-auto p-4 pt-20"
            onClick={() => setPreviewOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-slate-900 border-b dark:border-slate-700 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Preview Berita
                </h2>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <CloseIcon size={24} />
                </button>
              </div>
              <div className="p-8">
                <article className="prose dark:prose-invert lg:prose-xl max-w-none">
                  <h1>{watch("judul")}</h1>
                  <p className="lead">{watch("abstrak")}</p>
                  {gambarFiles.length > 0 && (
                    <div className="not-prose my-8">
                      <Image
                        src={
                          gambarFiles[0] instanceof File
                            ? URL.createObjectURL(gambarFiles[0])
                            : (gambarFiles[0] as { url: string }).url
                        }
                        alt="Gambar utama"
                        width={800}
                        height={450}
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: watch("isiBerita") }}
                  />
                </article>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BuatBerita;
