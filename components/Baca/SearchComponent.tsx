"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowDownUp,
  LoaderCircle,
  X,
} from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SearchParams {
  keyword: string;
  kategori: string;
  subKategori: string;
  urutkan: "hits" | "judul";
}

interface SearchComponentProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
  isSidebar?: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  isLoading = false,
  isSidebar = false,
}) => {
  const [keyword, setKeyword] = useState("");
  const [kategori, setKategori] = useState("");
  const [subKategori, setSubKategori] = useState("");
  const [urutkan, setUrutkan] = useState<"hits" | "judul">("hits");

  const [availableKategori, setAvailableKategori] = useState<string[]>([]);
  const [availableSubKategori, setAvailableSubKategori] = useState<string[]>(
    []
  );
  const [fetchingOptions, setFetchingOptions] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingOptions(true);
      try {
        const result = await prisma.reading_materials.findMany({
          distinct: ["kategori"],
          select: { kategori: true },
          where: { kategori: { not: null } },
        });
        const categories = result
          .map((item: { kategori: unknown }) => item.kategori as string)
          .filter(Boolean);
        setAvailableKategori(categories);
      } catch (error) {
        console.error("Gagal mengambil kategori dari database:", error);
      } finally {
        setFetchingOptions(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (kategori) {
        setFetchingOptions(true);
        try {
          const result = await prisma.reading_materials.findMany({
            distinct: ["sub_kategori"],
            select: { sub_kategori: true },
            where: {
              kategori: kategori,
              sub_kategori: { not: null },
            },
          });
          const subCategories = result
            .map(
              (item: { sub_kategori: unknown }) => item.sub_kategori as string
            )
            .filter(Boolean);
          setAvailableSubKategori(subCategories);
        } catch (error) {
          console.error("Gagal mengambil sub-kategori dari database:", error);
        } finally {
          setFetchingOptions(false);
        }
      } else {
        setAvailableSubKategori([]);
      }
      setSubKategori("");
    };
    fetchSubCategories();
  }, [kategori]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword: keyword.trim(), kategori, subKategori, urutkan });
  };

  const handleReset = () => {
    setKeyword("");
    setKategori("");
    setSubKategori("");
    setUrutkan("hits");
    onSearch({ keyword: "", kategori: "", subKategori: "", urutkan: "hits" });
  };

  // --- PERBAIKAN: Kelas warna teks & UI disesuaikan dengan variabel CSS tema ---
  const inputBaseStyle =
    "w-full appearance-none rounded-lg p-2.5 focus:ring-1 focus:outline-none transition-colors " +
    "bg-[rgb(var(--surface-input))] border-[rgb(var(--ui-border-input))] text-[rgb(var(--text-primary))] " +
    "placeholder-[rgb(var(--text-placeholder))] focus:ring-[rgb(var(--brand-primary))] focus:border-[rgb(var(--brand-primary))] " +
    "disabled:bg-[rgb(var(--ui-border))] disabled:text-[rgb(var(--text-secondary))] disabled:cursor-not-allowed";

  const labelBaseStyle =
    "block text-sm font-medium text-[rgb(var(--text-primary))] mb-1.5"; // Menggunakan text-primary untuk label

  const buttonPrimaryStyle =
    "w-full bg-[rgb(var(--brand-primary))] hover:bg-[rgb(var(--brand-primary-hover))] text-[rgb(var(--text-on-brand))] " +
    "font-semibold px-4 py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2 " +
    "disabled:opacity-70 disabled:cursor-wait";

  const buttonSecondaryStyle =
    "w-full bg-[rgb(var(--ui-border))] hover:bg-[rgb(var(--ui-border))] text-[rgb(var(--text-secondary))] " + // Menggunakan ui-border untuk background
    "font-medium px-4 py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2 " +
    "border border-[rgb(var(--ui-border))] disabled:opacity-70";

  const formElements = (
    <>
      <div className={`${isSidebar ? "col-span-1" : "sm:col-span-2"}`}>
        <label
          htmlFor="keyword-search"
          className={`${labelBaseStyle} ${isSidebar ? "" : "sm:text-center"}`}
        >
          Kata Kunci
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[rgb(var(--text-placeholder))]" />{" "}
            {/* Warna ikon disesuaikan */}
          </span>
          <input
            type="search"
            id="keyword-search"
            className={`${inputBaseStyle} pl-10 pr-4`}
            placeholder="Cari judul, deskripsi..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Kata kunci pencarian"
            disabled={isLoading || fetchingOptions}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="kategori-filter"
          className={`${labelBaseStyle} ${isSidebar ? "" : "sm:text-center"}`}
        >
          Kategori
        </label>
        <div className="relative">
          <select
            id="kategori-filter"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className={`${inputBaseStyle} pr-8`}
            disabled={isLoading || fetchingOptions}
          >
            <option value="">Semua Kategori</option>
            {availableKategori.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-placeholder))] pointer-events-none" // Warna ikon disesuaikan
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subkategori-filter"
          className={`${labelBaseStyle} ${isSidebar ? "" : "sm:text-center"}`}
        >
          Sub-Kategori / Topik
        </label>
        <div className="relative">
          <select
            id="subkategori-filter"
            value={subKategori}
            onChange={(e) => setSubKategori(e.target.value)}
            className={`${inputBaseStyle} pr-8`} // Kelas disabled sudah di inputBaseStyle
            disabled={
              !kategori ||
              availableSubKategori.length === 0 ||
              isLoading ||
              fetchingOptions
            }
          >
            <option value="">Semua Topik</option>
            {availableSubKategori.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-placeholder))] pointer-events-none" // Warna ikon disesuaikan
          />
        </div>
      </div>
    </>
  );

  if (isSidebar) {
    return (
      <aside className="md:col-span-4 lg:col-span-3">
        <form
          onSubmit={handleSearch}
          className="bg-[rgb(var(--surface-card))] p-4 sm:p-5 rounded-xl shadow-lg space-y-4 sticky top-20 border border-[rgb(var(--ui-border))]" // Warna background, border, shadow disesuaikan
        >
          <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))] flex items-center gap-2 border-b border-[rgb(var(--ui-border))] pb-3">
            {" "}
            {/* Warna teks dan border disesuaikan */}
            <Filter
              size={20}
              className="text-[rgb(var(--brand-primary))]"
            />{" "}
            Filter Pencarian {/* Warna ikon disesuaikan */}
          </h2>
          {formElements}
          <div className="space-y-3 pt-2 border-t border-[rgb(var(--ui-border))]/50 mt-2">
            {" "}
            {/* Warna border disesuaikan */}
            <div>
              <label
                htmlFor="sort-order-sidebar"
                className={`${labelBaseStyle}`}
              >
                Urutkan berdasarkan
              </label>
              <div className="relative">
                <select
                  id="sort-order-sidebar"
                  value={urutkan}
                  onChange={(e) =>
                    setUrutkan(e.target.value as "hits" | "judul")
                  }
                  className={`${inputBaseStyle} pr-8`}
                  aria-label="Urutkan hasil"
                  disabled={isLoading || fetchingOptions}
                >
                  <option value="hits">Terpopuler</option>
                  <option value="judul">Judul A-Z</option>
                </select>
                <ArrowDownUp
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-placeholder))] pointer-events-none" // Warna ikon disesuaikan
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || fetchingOptions}
              className={buttonPrimaryStyle} // Menggunakan variabel style
            >
              {isLoading || fetchingOptions ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Terapkan Filter
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading || fetchingOptions}
              className={buttonSecondaryStyle} // Menggunakan variabel style
            >
              <X size={16} /> Reset
            </button>
          </div>
        </form>
      </aside>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-[rgb(var(--brand-secondary))] p-6 sm:p-8 rounded-2xl shadow-xl border border-[rgb(var(--ui-border))]/30">
      {" "}
      {/* <<< PERBAIKAN DI SINI */}
      <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] text-center mb-1">
        Cari Materi Ruang Baca
      </h2>
      <p className="text-sm text-[rgb(var(--text-secondary))] text-center mb-6">
        Temukan dokumen, panduan, dan materi yang Anda butuhkan dengan mudah.
      </p>
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-end"
      >
        {formElements}
        <div className="sm:col-span-2 flex flex-col sm:flex-row-reverse gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading || fetchingOptions}
            className={buttonPrimaryStyle}
          >
            {isLoading || fetchingOptions ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
            Cari
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading || fetchingOptions}
            className={buttonSecondaryStyle}
          >
            Reset Filter
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
