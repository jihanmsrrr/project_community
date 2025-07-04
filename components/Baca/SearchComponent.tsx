// components/Baca/SearchComponent.tsx
"use client";

import React from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowDownUp,
  LoaderCircle,
  X,
} from "lucide-react";

export interface SearchParams {
  keyword: string;
  kategori: string;
  subKategori: string;
  urutkan: "hits" | "judul";
}

interface SearchComponentProps {
  params: SearchParams;
  onParamsChange: (newParams: SearchParams) => void;
  onSearch: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  isSidebar?: boolean;
  availableKategori: string[];
  availableSubKategori: string[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  params,
  onParamsChange,
  onSearch,
  onReset,
  isLoading = false,
  isSidebar = false,
  availableKategori,
  availableSubKategori,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newParams = { ...params, [name]: value };
    if (name === "kategori") newParams.subKategori = "";
    onParamsChange(newParams);
    if (
      isSidebar &&
      (name === "kategori" || name === "urutkan" || name === "subKategori")
    )
      onSearch();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const inputBaseStyle =
    "w-full appearance-none rounded-lg p-2.5 focus:ring-1 focus:outline-none transition-colors bg-surface-input border border-ui-border-input text-text-primary placeholder-text-placeholder focus:ring-brand-primary focus:border-brand-primary disabled:bg-ui-border disabled:text-text-secondary disabled:cursor-not-allowed";
  const labelBaseStyle = "block text-sm font-medium text-text-primary mb-1.5";
  const buttonPrimaryStyle =
    "w-full bg-brand-primary hover:bg-brand-primary-hover text-text-on-brand font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait";
  const buttonSecondaryStyle =
    "w-full bg-surface-card hover:bg-surface-hover text-text-secondary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 border border-ui-border disabled:opacity-70";

  const formElements = (
    <>
      <div className={`${isSidebar ? "col-span-1" : "sm:col-span-2"}`}>
        <label
          htmlFor="keyword"
          className={`${labelBaseStyle} ${isSidebar ? "" : "sm:text-center"}`}
        >
          Kata Kunci
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-text-placeholder" />
          </span>
          <input
            type="search"
            id="keyword"
            name="keyword"
            className={`${inputBaseStyle} pl-10 pr-4`}
            placeholder="Cari judul, deskripsi..."
            value={params.keyword}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="kategori"
          className={`${labelBaseStyle} ${isSidebar ? "" : "sm:text-center"}`}
        >
          Kategori
        </label>
        <div className="relative">
          <select
            id="kategori"
            name="kategori"
            value={params.kategori}
            onChange={handleInputChange}
            className={`${inputBaseStyle} pr-8`}
            disabled={isLoading}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="subKategori"
          className={`${labelBaseStyle} ${isSidebar ? "" : "sm:text-center"}`}
        >
          Sub-Kategori
        </label>
        <div className="relative">
          <select
            id="subKategori"
            name="subKategori"
            value={params.subKategori}
            onChange={handleInputChange}
            className={`${inputBaseStyle} pr-8`}
            disabled={
              !params.kategori || availableSubKategori.length === 0 || isLoading
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
          />
        </div>
      </div>
    </>
  );

  if (isSidebar) {
    return (
      <aside>
        <form
          onSubmit={handleSubmit}
          className="bg-surface-card p-4 sm:p-5 rounded-xl shadow-lg space-y-4 sticky top-20 border border-ui-border"
        >
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 border-b border-ui-border pb-3">
            <Filter size={20} className="text-brand-primary" />
            Filter Pencarian
          </h2>
          {formElements}
          <div className="space-y-3 pt-2 border-t border-ui-border/50 mt-2">
            <div>
              <label htmlFor="urutkan" className={labelBaseStyle}>
                Urutkan berdasarkan
              </label>
              <div className="relative">
                <select
                  id="urutkan"
                  name="urutkan"
                  value={params.urutkan}
                  onChange={handleInputChange}
                  className={`${inputBaseStyle} pr-8`}
                  disabled={isLoading}
                >
                  <option value="hits">Terpopuler</option>
                  <option value="judul">Judul A-Z</option>
                </select>
                <ArrowDownUp
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={buttonPrimaryStyle}
            >
              {isLoading ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}{" "}
              Cari
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={isLoading}
              className={buttonSecondaryStyle}
            >
              <X size={16} /> Keluar Pencarian
            </button>
          </div>
        </form>
      </aside>
    );
  }

  return (
    // --- PERBAIKAN: Layout diubah agar latar belakang membentang penuh ---
    <div className="w-full bg-surface-card border-y border-ui-border/50">
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-1">
          Cari Materi Ruang Baca
        </h2>
        <p className="text-sm text-text-secondary text-center mb-6">
          Temukan dokumen, panduan, dan materi yang Anda butuhkan dengan mudah.
        </p>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-end"
        >
          {formElements}
          <div className="sm:col-span-2 flex flex-col sm:flex-row-reverse gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={buttonPrimaryStyle}
            >
              {isLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}{" "}
              Cari Materi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchComponent;
