// pages/search.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Search, Newspaper, Users, BookOpen, LoaderCircle } from "lucide-react";

// --- Tipe Data untuk Hasil Pencarian ---
interface NewsResult {
  news_id: number;
  judul: string;
  abstrak: string;
  publishedAt: string;
}
interface UserResult {
  user_id: number;
  nama_lengkap: string;
  jabatan_struktural: string;
  foto_url: string;
}
interface DocumentResult {
  material_id: number;
  judul: string;
  deskripsi: string;
  bacaUrl: string;
}
interface SearchResults {
  berita: NewsResult[];
  pegawai: UserResult[];
  ruangBaca: DocumentResult[];
}

// --- Komponen Header Pencarian ---
const SearchHeader = ({
  query,
  onSearch,
}: {
  query: string;
  onSearch: (newQuery: string) => void;
}) => {
  const [localQuery, setLocalQuery] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  return (
    <div className="relative bg-brand-primary text-text-on-brand py-16 md:py-20">
      <div className="absolute inset-0 bg-[url('/bg2.png')] bg-cover bg-bottom opacity-20"></div>
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <p className="text-lg text-text-on-brand/80">Hasil pencarian untuk:</p>
        <h1 className="text-4xl md:text-5xl font-bold break-words">{`"${query}"`}</h1>
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex items-center bg-surface-card rounded-xl shadow-lg max-w-full mx-auto overflow-hidden border border-ui-border/50 focus-within:ring-2 focus-within:ring-brand-accent transition-all"
        >
          <input
            type="text"
            placeholder="Cari lagi..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="flex-grow text-text-primary text-base px-6 py-3 bg-transparent outline-none"
            aria-label="Cari"
          />
          <button
            type="submit"
            className="bg-brand-accent hover:bg-brand-accent-hover transition-colors duration-200 px-5 py-3 flex items-center justify-center cursor-pointer"
            aria-label="Cari"
          >
            <Search size={20} className="text-text-on-accent" />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Komponen Kartu Hasil Pencarian ---
const ResultCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-surface-card rounded-xl border border-ui-border/50 shadow-sm">
    <div className="flex items-center gap-3 p-4 border-b border-ui-border/50">
      {icon}
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
    </div>
    <div className="p-4 space-y-4">{children}</div>
  </div>
);

// --- Halaman Utama Hasil Pencarian ---
export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (q && typeof q === "string") {
      setLoading(true);
      setError(null);
      fetch(`/api/search?q=${q}`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data pencarian.");
          return res.json();
        })
        .then((data) => {
          setResults(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [q]);

  const handleNewSearch = (newQuery: string) => {
    router.push(`/search?q=${newQuery}`);
  };

  const hasResults =
    results &&
    (results.berita.length > 0 ||
      results.pegawai.length > 0 ||
      results.ruangBaca.length > 0);

  return (
    <div className="bg-surface-page min-h-screen">
      <SearchHeader query={(q as string) || ""} onSearch={handleNewSearch} />

      <main className="max-w-screen-xl mx-auto w-full p-4 md:p-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle className="w-12 h-12 animate-spin text-brand-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-feedback-error-text">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          (!hasResults ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-text-primary">
                Tidak Ada Hasil
              </h2>
              <p className="text-text-secondary mt-2">
                Coba gunakan kata kunci lain yang lebih umum.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {results?.berita.length > 0 && (
                <ResultCard
                  icon={<Newspaper className="text-brand-primary" />}
                  title="Berita Terkait"
                >
                  {results.berita.map((item) => (
                    <Link
                      key={item.news_id}
                      href={`/news/${item.news_id}`}
                      passHref
                    >
                      <a className="block p-3 rounded-lg hover:bg-surface-hover transition-colors">
                        <h3 className="font-semibold text-text-primary">
                          {item.judul}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                          {item.abstrak}
                        </p>
                      </a>
                    </Link>
                  ))}
                </ResultCard>
              )}

              {results?.pegawai.length > 0 && (
                <ResultCard
                  icon={<Users className="text-brand-primary" />}
                  title="Pegawai Ditemukan"
                >
                  {results.pegawai.map((item) => (
                    <Link
                      key={item.user_id}
                      href={`/profil/${item.user_id}`}
                      passHref
                    >
                      <a className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors">
                        <Image
                          src={item.foto_url || "/avatar-placeholder.png"}
                          alt={item.nama_lengkap}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-text-primary">
                            {item.nama_lengkap}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {item.jabatan_struktural}
                          </p>
                        </div>
                      </a>
                    </Link>
                  ))}
                </ResultCard>
              )}

              {results?.ruangBaca.length > 0 && (
                <ResultCard
                  icon={<BookOpen className="text-brand-primary" />}
                  title="Dokumen di Ruang Baca"
                >
                  {results.ruangBaca.map((item) => (
                    <Link key={item.material_id} href={item.bacaUrl} passHref>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        <h3 className="font-semibold text-text-primary">
                          {item.judul}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                          {item.deskripsi}
                        </p>
                      </a>
                    </Link>
                  ))}
                </ResultCard>
              )}
            </div>
          ))}
      </main>
    </div>
  );
}
