"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UploadCloud, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";

// --- Tipe Data dan Data Konstan ---
interface FormDataType {
  judul: string;
  kategori: string;
  kataKunci: string[];
  abstrak: string;
  isiBerita: string;
  status: "draft" | "pending_review" | "published" | "revision";
  gambarFiles: (File | { url: string; name: string })[];
}

const kategoriOptions = [
  "BPS Terkini",
  "Berita Daerah",
  "Serba Serbi",
  "Fotogenik",
  "Wisata",
  "Opini",
];
const kataKunciPopuler = [
  "ekonomi",
  "inflasi",
  "pertanian",
  "sensus",
  "survei",
  "teknologi",
  "pendidikan",
  "kemiskinan",
  "tenaga kerja",
  "ekspor-impor",
];

const IconUpload: React.FC = () => (
  <UploadCloud className="h-10 w-10 mx-auto text-text-placeholder" />
);

// === KOMPONEN UTAMA FORM BERITA ===
const BuatBerita: React.FC<{ articleId?: string }> = ({ articleId }) => {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/login?callbackUrl=${router.asPath}`);
    },
  });
  const isEditMode = !!articleId;

  // --- State Komponen ---
  const [inputKataKunci, setInputKataKunci] = useState("");
  const [autocompleteList, setAutocompleteList] = useState<string[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [revisiPesan, setRevisiPesan] = useState<string | null>(null);

  // --- react-hook-form Setup ---
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isValid, isSubmitting },
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
  const currentStatus = watch("status");
  const gambarFiles = watch("gambarFiles");

  // Fetch data jika ini mode edit
  useEffect(() => {
    if (isEditMode && articleId && session) {
      const fetchArticleData = async () => {
        try {
          const response = await fetch(`/api/berita/${articleId}`);
          if (!response.ok) throw new Error("Gagal mengambil data artikel.");
          const dataToEdit = await response.json();

          if (
            session?.user?.role !== "admin" &&
            session?.user?.id !== dataToEdit.penulisId
          ) {
            alert("Anda tidak memiliki izin untuk mengedit berita ini.");
            router.push("/varia-statistik");
            return;
          }

          reset({
            judul: dataToEdit.judul,
            kategori: dataToEdit.kategori,
            kataKunci: dataToEdit.kataKunci || [],
            abstrak: dataToEdit.abstrak,
            isiBerita: dataToEdit.isiBerita,
            status: dataToEdit.status,
            gambarFiles: dataToEdit.gambarFiles || [],
          });
          setRevisiPesan(dataToEdit.revisiPesan || null);
        } catch (error) {
          console.error("Fetch error:", (error as Error).message);
          router.push("/varia-statistik");
        }
      };
      fetchArticleData();
    }
  }, [articleId, isEditMode, reset, session, router]);

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
      setAutocompleteList([]);
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

  useEffect(() => {
    if (inputKataKunci) {
      setAutocompleteList(
        kataKunciPopuler.filter(
          (k) =>
            k.toLowerCase().includes(inputKataKunci.toLowerCase()) &&
            !kataKunciValues.includes(k)
        )
      );
    } else {
      setAutocompleteList([]);
    }
  }, [inputKataKunci, kataKunciValues]);

  useEffect(() => {
    const newPreviews = gambarFiles
      .map((file) => {
        if (file instanceof File) return URL.createObjectURL(file);
        if (typeof file === "object" && file.url) return file.url;
        return "";
      })
      .filter(Boolean);
    setFilePreviews(newPreviews);
    return () => {
      newPreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [gambarFiles]);

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

  const submitBerita = async (data: FormDataType) => {
    if (!session?.user) {
      alert("Sesi Anda telah berakhir, silakan login kembali.");
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("kategori", data.kategori);
    formData.append("abstrak", data.abstrak);
    formData.append("isiBerita", data.isiBerita);
    formData.append("status", data.status);
    formData.append("namaPenulis", session.user.name || ""); // Gunakan nama dari session
    formData.append("penulisId", session.user.id || ""); // Gunakan ID dari session
    data.kataKunci.forEach((k) => formData.append("kataKunci[]", k));
    data.gambarFiles.forEach((file) => {
      if (file instanceof File) formData.append("gambarFiles", file);
    });

    try {
      const endpoint = isEditMode
        ? `/api/berita/update/${articleId}`
        : "/api/berita/";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, { method, body: formData });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Gagal menyimpan berita."
        );

      const result = await response.json();
      alert(`Berita berhasil disimpan sebagai "${data.status}"!`);
      reset();
      router.push(`/varia-statistik/artikel/${result.id}`);
    } catch (error) {
      alert(`Terjadi kesalahan: ${(error as Error).message}`);
    }
  };

  const processFormSubmission =
    (status: FormDataType["status"]) => (data: FormDataType) => {
      submitBerita({ ...data, status });
    };

  const handlePreview = async () => {
    const isValidForm = await trigger();
    if (isValidForm) setPreviewOpen(true);
    else
      alert(
        "Harap lengkapi semua kolom yang wajib diisi sebelum melihat preview."
      );
  };

  if (authStatus === "loading") {
    return <div className="text-center p-10">Memuat data pengguna...</div>;
  }

  if (!session) {
    // Ini hanya fallback, karena `onUnauthenticated` akan menangani redirect
    return (
      <div className="text-center p-10 text-status-red">
        Sesi tidak ditemukan. Mengarahkan ke halaman login...
      </div>
    );
  }

  const statusInfoMap = {
    draft: {
      text: "Draft",
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300",
    },
    pending_review: {
      text: "Menunggu Review",
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300",
    },
    published: {
      text: "Published",
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/50 dark:text-green-300",
    },
    revision: {
      text: "Perlu Revisi",
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/50 dark:text-red-300",
    },
  };

  const statusInfo = statusInfoMap[currentStatus] || statusInfoMap.draft;

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Varia Statistik", href: "/varia-statistik" },
          { label: isEditMode ? "Edit Berita" : "Buat Berita" },
        ]}
      />
      {revisiPesan && (
        <div className="mb-6 p-4 border-l-4 border-status-red bg-status-red/10 text-status-red-dark rounded-r-lg shadow">
          <strong className="font-bold block">Pesan Revisi dari Admin:</strong>
          <span>{revisiPesan}</span>
        </div>
      )}
      <form
        className="bg-surface-card p-6 sm:p-8 rounded-xl shadow-lg space-y-8"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg bg-surface-page border border-ui-border">
          <div>
            <p className="text-xs text-text-secondary">Penulis</p>
            <p className="font-semibold text-text-primary">
              {session?.user?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-secondary">
              Status:
            </span>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${statusInfo.bg} ${statusInfo.color}`}
            >
              {statusInfo.text}
            </span>
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
            {...register("judul", {
              required: "Judul wajib diisi",
              minLength: { value: 10, message: "Minimal 10 karakter" },
              maxLength: { value: 120, message: "Maksimal 120 karakter" },
            })}
            className={`block w-full px-4 py-3 bg-surface-input border rounded-md shadow-sm placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
              errors.judul
                ? "border-status-red focus:ring-status-red"
                : "border-ui-border-input focus:ring-brand-primary"
            }`}
            placeholder="Contoh: BPS Merilis Angka Pertumbuhan Ekonomi..."
          />
          {errors.judul && (
            <p className="text-status-red mt-1 text-xs font-semibold">
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
              className={`block w-full px-4 py-3 bg-surface-input border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.kategori
                  ? "border-status-red focus:ring-status-red"
                  : "border-ui-border-input focus:ring-brand-primary"
              }`}
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            {errors.kategori && (
              <p className="text-status-red mt-1 text-xs font-semibold">
                {errors.kategori.message}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="kataKunciInput"
              className="block text-sm font-bold text-text-secondary mb-2"
            >
              Kata Kunci (Maksimal 5)
            </label>
            <div className="relative">
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
                className="block w-full px-4 py-3 bg-surface-input border rounded-md shadow-sm focus:outline-none focus:ring-2 border-ui-border-input focus:ring-brand-primary"
                autoComplete="off"
                disabled={kataKunciValues.length >= 5}
              />
              {autocompleteList.length > 0 && (
                <ul className="absolute z-10 w-full bg-surface-card border border-ui-border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {autocompleteList.map((k) => (
                    <li
                      key={k}
                      className="px-4 py-2 text-sm text-text-primary hover:bg-surface-hover cursor-pointer"
                      onClick={() => addKataKunci(k)}
                    >
                      {k}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                    className="ml-2 font-bold opacity-70 hover:opacity-100"
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
            {...register("abstrak", {
              required: "Abstrak wajib diisi",
              minLength: { value: 50, message: "Minimal 50 karakter" },
              maxLength: { value: 250, message: "Maksimal 250 karakter" },
            })}
            className={`block w-full px-4 py-3 bg-surface-input border rounded-md shadow-sm placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
              errors.abstrak
                ? "border-status-red focus:ring-status-red"
                : "border-ui-border-input focus:ring-brand-primary"
            }`}
            placeholder="Ringkasan singkat yang menarik..."
          />
          {errors.abstrak && (
            <p className="text-status-red mt-1 text-xs font-semibold">
              {errors.abstrak.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-text-secondary mb-2">
            Isi Berita
          </label>
          <div
            className={
              errors.isiBerita ? "rounded-md ring-2 ring-status-red" : ""
            }
          >
            <Controller
              name="isiBerita"
              control={control}
              rules={{ required: "Isi berita tidak boleh kosong." }}
              render={({ field }) => (
                <Editor
                  apiKey="tiny.cloud"
                  value={field.value}
                  onEditorChange={field.onChange}
                  init={{
                    height: 400,
                    menubar: false,
                    plugins:
                      "autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                    toolbar:
                      "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image | help",
                    skin:
                      typeof window !== "undefined" &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "oxide-dark"
                        : "oxide",
                    content_css:
                      typeof window !== "undefined" &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "dark"
                        : "",
                  }}
                />
              )}
            />
          </div>
          {errors.isiBerita && (
            <p className="text-status-red mt-1 text-xs font-semibold">
              {errors.isiBerita.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-text-secondary mb-2">
            Gambar Pendukung (Maksimal 5)
          </label>
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-ui-border-input border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <IconUpload />
              <div className="flex text-sm text-text-secondary">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-surface-card rounded-md font-medium text-brand-primary hover:text-brand-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary"
                >
                  <span className="px-1">Upload file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">atau drag and drop</p>
              </div>
              <p className="text-xs text-text-placeholder">
                PNG, JPG, GIF hingga 10MB
              </p>
            </div>
          </div>
          {filePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {filePreviews.map((url, i) => (
                <div key={i} className="relative group aspect-square">
                  <Image
                    src={url}
                    alt={`Preview ${i + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeGambar(i)}
                      className="w-8 h-8 rounded-full bg-status-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Hapus gambar"
                    >
                      <CloseIcon size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-6 border-t border-ui-border flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleSubmit(processFormSubmission("draft"))}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 border border-ui-border rounded-md shadow-sm text-sm font-bold text-text-secondary bg-surface-button-secondary hover:bg-surface-button-secondary-hover transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan sebagai Draft"}
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-text-secondary bg-ui-border hover:bg-ui-border/70 transition-all"
          >
            Preview Berita
          </button>
          <button
            type="button"
            onClick={handleSubmit(processFormSubmission("pending_review"))}
            disabled={!isValid || isSubmitting}
            className="w-full sm:flex-1 px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-text-on-brand bg-brand-primary hover:bg-brand-primary-hover transition-all disabled:bg-brand-primary/50 disabled:cursor-not-allowed"
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
                <h2
                  id="previewTitle"
                  className="text-2xl font-bold text-gray-800 dark:text-gray-100"
                >
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
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 not-prose mb-6">
                    <span className="font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {watch("kategori")}
                    </span>
                    {kataKunciValues.length > 0 && (
                      <span className="border-l pl-4">
                        Kata Kunci: {kataKunciValues.join(", ")}
                      </span>
                    )}
                  </div>
                  <p className="lead">{watch("abstrak")}</p>
                  {filePreviews.length > 0 && (
                    <div className="not-prose my-8">
                      <Image
                        src={filePreviews[0]}
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
                  {filePreviews.length > 1 && (
                    <div className="not-prose mt-8">
                      <h3 className="font-bold text-lg mb-4">Gambar Lainnya</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {filePreviews.slice(1).map((url, i) => (
                          <Image
                            key={i}
                            src={url}
                            alt={`Gambar tambahan ${i + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-auto object-cover rounded-md shadow-sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </article>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="mt-8 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-semibold"
                >
                  Tutup Preview
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuatBerita;
