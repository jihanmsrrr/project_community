// pages/varia-statistik/artikel/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { ArtikelBerita } from "@/types/varia";
import { getVariaStatistikLayout } from "@/components/Berita/Utama/VariaStatistikLayout";
import { LoaderCircle, AlertTriangle, User, Calendar, Eye } from "lucide-react";
import Image from "next/image";

const ArticleDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<ArtikelBerita | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Jalankan fetch hanya jika router sudah siap dan ada ID di URL
    if (router.isReady && id) {
      const fetchArticle = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/berita/${id}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal memuat artikel.");
          }
          const data: ArtikelBerita = await response.json();
          setArticle(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchArticle();
    }
  }, [router.isReady, id]);

  // Tampilkan loader saat data sedang diambil
  if (isLoading || !router.isReady) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoaderCircle className="w-12 h-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Tampilkan pesan error jika fetch gagal
  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <p className="mt-4 font-semibold text-red-700">Terjadi Kesalahan</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Tampilkan pesan jika artikel tidak ditemukan setelah selesai loading
  if (!article) {
    return (
      <div className="text-center py-20">
        <p>Artikel tidak ditemukan.</p>
      </div>
    );
  }

  const gambarUrls = article.gambar_urls as { url: string }[] | null;
  const mainImageUrl =
    gambarUrls && gambarUrls.length > 0
      ? gambarUrls[0].url
      : "https://placehold.co/1200x600/64748B/FFFFFF/png?text=Gambar+Tidak+Tersedia";

  return (
    <article className="max-w-4xl mx-auto bg-surface-card p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-ui-border/50">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight mb-4">
          {article.judul}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{article.nama_penulis}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <time dateTime={new Date(article.savedAt).toISOString()}>
              {new Date(article.savedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} />
            {/* Ganti dengan data 'hits' dari database jika sudah ada */}
            <span>{Math.floor(Math.random() * 1000)} Dilihat</span>
          </div>
        </div>
      </div>

      <figure className="mb-8">
        <Image
          src={mainImageUrl}
          alt={`Gambar utama untuk artikel ${article.judul}`}
          width={1200}
          height={600}
          className="w-full h-auto rounded-xl object-cover bg-gray-200"
          priority
        />
      </figure>

      {/* Tampilkan isi berita dengan aman */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.isi_berita }}
      />
    </article>
  );
};

// Terapkan layout ke halaman ini agar header selalu muncul
ArticleDetailPage.getLayout = getVariaStatistikLayout;

export default ArticleDetailPage;
