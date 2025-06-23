// pages/varia-statistik/artikel/[id].tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";

// Tipe Data & Helper
import type { ArtikelBerita, NewsCardItem } from "@/types/varia";
import { mapArtikelToNewsCardItem } from "@/utils/mapper"; // Pastikan path ini benar

// Komponen UI
import Breadcrumb from "@/components/ui/Breadcrumb";
import Skeleton from "@/components/ui/Skeleton";
import NewsCard from "@/components/Berita/Card/NewsCard";
import VariaStatistikPageHeader from "@/components/Berita/Utama/VariaStatistikPageHeader"; // Import VariaStatistikPageHeader

// BARU: Komponen yang diimpor sesuai instruksi
import ArticleSidebar from "@/components/Berita/TampilBerita/ArticleSidebar"; // Pastikan path ini benar
import ArticleActions from "@/components/Berita/TampilBerita/ArticleActions";
import CommentSection from "@/components/Berita/TampilBerita/CommentSection";

export default function SingleArticlePage() {
  // --- DEKLARASI HOOKS & STATE ---
  const router = useRouter();
  const { id } = router.query;

  const [artikel, setArtikel] = useState<ArtikelBerita | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIKA PENGAMBILAN DATA ---
  useEffect(() => {
    if (router.isReady && id) {
      const fetchArticleData = async () => {
        setIsLoading(true);
        setError(null);
        setRelatedArticles([]);

        try {
          // 1. Ambil data artikel utama
          const articleRes = await fetch(`/api/berita/${id}`);
          if (!articleRes.ok)
            throw new Error("Berita yang Anda cari tidak dapat ditemukan.");
          const articleData: ArtikelBerita = await articleRes.json();
          setArtikel(articleData);

          // 2. Setelah artikel utama didapat, ambil berita terkait
          const relatedRes = await fetch(
            `/api/berita/related?currentId=${
              articleData.id
            }&category=${encodeURIComponent(articleData.kategori)}`
          );
          if (relatedRes.ok) {
            const relatedData: ArtikelBerita[] = await relatedRes.json();
            // 3. Gunakan mapper untuk mengubah data ke format kartu berita
            setRelatedArticles(relatedData.map(mapArtikelToNewsCardItem));
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred.");
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchArticleData();
    }
  }, [router.isReady, id]);

  // --- TAMPILAN LOADING ---
  if (isLoading) {
    return (
      <main className="bg-slate-50 dark:bg-slate-950 py-8 md:py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton height="h-6" width="w-1/2" className="mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-8 space-y-4">
              <Skeleton height="h-12" width="w-full" />
              <Skeleton height="h-96" width="w-full" />
              <Skeleton count={10} height="h-6" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton height="h-64" width="w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --- TAMPILAN ERROR ---
  if (error || !artikel) {
    return (
      <main className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Oops! Terjadi Kesalahan</h1>
        <p className="text-gray-500">{error || "Berita tidak dapat dimuat."}</p>
        <Link
          href="/varia-statistik"
          className="mt-8 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Kembali ke Daftar Berita
        </Link>
      </main>
    );
  }

  // --- TAMPILAN UTAMA (SUKSES) ---
  return (
    <div className="bg-slate-50 dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Tambahkan VariaStatistikPageHeader di sini */}
      <VariaStatistikPageHeader
        onSearch={() => {
          /* No search functionality directly from this header */
        }}
        hideSearchBar={true} // Sembunyikan search bar di header ini
      />
      <main className="py-8 md:py-12">
        {" "}
        {/* Hapus bg-slate-50 dark:bg-slate-950 karena sudah di div utama */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 1. BREADCRUMB */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Varia Statistik", href: "/varia-statistik" },
                {
                  label: artikel.kategori,
                  // Ganti ini agar sesuai dengan dynamic route kategori
                  href: `/varia-statistik/${artikel.kategori
                    .toLowerCase()
                    .replace(/\s/g, "-")}`,
                },
                { label: artikel.judul },
              ]}
            />
          </div>

          {/* 2. LAYOUT UTAMA: KONTEN & SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 xl:gap-12 items-start">
            <article className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-md">
              <header className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {artikel.judul}
                </h1>
              </header>

              {/* BARU: Tombol Aksi (Like, Share) */}
              <ArticleActions articleId={artikel.id} />

              {artikel.gambarFiles.length > 0 && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden my-8">
                  <Image
                    src={artikel.gambarFiles[0].url}
                    alt={artikel.judul}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              )}

              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: artikel.isiBerita }}
              />

              {artikel.kataKunci && artikel.kataKunci.length > 0 && (
                <footer className="mt-12 pt-6 border-t dark:border-slate-700">
                  <div className="flex flex-wrap items-center gap-3">
                    <Tag
                      size={18}
                      className="text-slate-500 dark:text-slate-400"
                    />
                    {artikel.kataKunci.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </footer>
              )}
            </article>

            <aside className="lg:col-span-4 sticky top-24">
              <ArticleSidebar artikel={artikel} />
            </aside>
          </div>

          {/* 3. BAGIAN BERITA TERKAIT & KOMENTAR (DI LUAR GRID UTAMA) */}
          <div className="mt-16 pt-12 border-t dark:border-slate-800">
            <div className="max-w-4xl mx-auto">
              {/* BERITA TERKAIT */}
              {relatedArticles.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                    Berita Terkait
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedArticles.map((item) => (
                      <NewsCard key={item.id} newsItem={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* BARU: BAGIAN KOMENTAR */}
              <section>
                <CommentSection articleId={artikel.id} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
