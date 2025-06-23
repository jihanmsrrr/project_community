// components/Baca/SearchComponent.tsx
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
import { modulData } from "@/data/modulData";

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
  const [availableSubKategori, setAvailableSubKategori] = useState<
    { id: string; nama: string }[]
  >([]);

  useEffect(() => {
    if (kategori) {
      const selectedKategoriData = modulData.find((k) => k.id === kategori);
      setAvailableSubKategori(
        selectedKategoriData?.subKategori.map((sub) => ({
          id: sub.id,
          nama: sub.nama,
        })) || []
      );
    } else {
      setAvailableSubKategori([]);
    }
    setSubKategori("");
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

  // PERBAIKAN: Kelas warna teks dibuat statis (tidak berubah di dark mode)
  // Kelas untuk input dan select tetap theme-aware agar kontras dengan latar
  const inputBaseStyle =
    "w-full appearance-none bg-surface-input dark:bg-slate-700 border border-ui-border-input dark:border-slate-600 text-text-primary dark:text-text-primary-dark text-sm rounded-lg p-2.5 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors placeholder:text-text-placeholder dark:placeholder:text-slate-400 focus:outline-none";
  const labelBaseStyle =
    "block text-xs font-medium text-slate-600 dark:text-slate-500 mb-1.5"; // Contoh: abu-abu gelap yang tetap terlihat di latar gelap

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
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          </span>
          <input
            type="search"
            id="keyword-search"
            className={`${inputBaseStyle} pl-10 pr-4`}
            placeholder="Cari judul, deskripsi..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Kata kunci pencarian"
            disabled={isLoading}
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
            disabled={isLoading}
          >
            <option value="">Semua Kategori</option>
            {modulData.map((kat) => (
              <option key={kat.id} value={kat.id}>
                {kat.namaTampil}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
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
            className={`${inputBaseStyle} pr-8 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed`}
            disabled={
              !kategori || availableSubKategori.length === 0 || isLoading
            }
          >
            <option value="">Semua Topik</option>
            {availableSubKategori.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.nama}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
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
          className="bg-surface-card p-4 sm:p-5 rounded-xl shadow-lg space-y-4 sticky top-20"
        >
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 border-b border-ui-border pb-3">
            <Filter size={20} className="text-brand-primary" /> Filter Pencarian
          </h2>
          {formElements}
          <div className="space-y-3 pt-2 border-t border-ui-border/50 mt-2">
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
                  disabled={isLoading}
                >
                  <option value="hits">Terpopuler</option>
                  <option value="judul">Judul A-Z</option>
                </select>
                <ArrowDownUp
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-text-on-brand font-semibold px-4 py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Terapkan Filter
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="w-full bg-surface-button-secondary hover:bg-surface-button-secondary-hover text-text-on-button-secondary font-medium px-4 py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2 border border-ui-border disabled:opacity-70"
            >
              <X size={16} /> Reset
            </button>
          </div>
        </form>
      </aside>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-surface-card p-6 sm:p-8 rounded-2xl shadow-xl border border-ui-border/30">
      <h2 className="text-2xl font-bold text-text-primary text-center mb-1">
        Cari Materi Ruang Baca
      </h2>
      <p className="text-sm text-text-secondary text-center mb-6">
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
            disabled={isLoading}
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover text-text-on-brand font-semibold px-8 py-2.5 rounded-full text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {isLoading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
            Cari
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="w-full sm:w-auto bg-transparent hover:bg-ui-border text-text-secondary font-medium px-8 py-2.5 rounded-full text-sm transition-colors disabled:opacity-70"
          >
            Reset Filter
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
