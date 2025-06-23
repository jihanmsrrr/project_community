// components/Search/FilterSidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, X, ArrowDownUp } from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export interface FilterValues {
  keyword: string;
  kategori: string;
  penulis: string;
  urutkan: "terbaru" | "judul";
  tanggalMulai: Date | null;
  tanggalSelesai: Date | null;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterValues) => void;
  onReset: () => void;
  initialKeyword?: string;
  categories: string[];
  authors: string[];
  initialCategory?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  onReset,
  initialKeyword,
  categories,
  initialCategory,
  authors,
}) => {
  const [filters, setFilters] = useState<FilterValues>({
    keyword: initialKeyword || "",
    kategori: "",
    penulis: "",
    urutkan: "terbaru",
    tanggalMulai: null, // State baru
    tanggalSelesai: null, // State baru
  });

  // Update state internal jika initialKeyword dari URL berubah
  useEffect(() => {
    // FIX 2: Juga berikan fallback di sini untuk menyelesaikan error TS2345.
    // Pastikan state 'keyword' tidak pernah di-set menjadi undefined.
    setFilters((prev) => ({
      ...prev,
      keyword: initialKeyword || "",
      kategori: initialCategory || "", // Set initial category from prop
    }));
  }, [initialKeyword, initialCategory]); // Tambahkan initialCategory ke dependency array

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setFilters((prev) => ({
      ...prev,
      tanggalMulai: start,
      tanggalSelesai: end,
    }));
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      keyword: "",
      kategori: "",
      penulis: "",
      urutkan: "terbaru",
      tanggalMulai: null,
      tanggalSelesai: null,
    };
    setFilters(resetFilters);
    onReset();
  };

  const inputBaseStyle =
    "w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 text-sm rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400";
  const labelBaseStyle =
    "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";

  return (
    <aside className="md:col-span-4 lg:col-span-3">
      <form
        onSubmit={handleFormSubmit}
        className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md space-y-5 sticky top-24"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <Filter size={20} /> Filter Pencarian
        </h2>
        <div>
          <label htmlFor="keyword" className={labelBaseStyle}>
            Kata Kunci
          </label>
          <input
            type="search"
            id="keyword"
            name="keyword"
            value={filters.keyword}
            onChange={handleInputChange}
            className={inputBaseStyle}
            placeholder="Cari judul deskripsi..."
          />
        </div>
        <div>
          <label htmlFor="kategori" className={labelBaseStyle}>
            Kategori
          </label>
          <select
            id="kategori"
            name="kategori"
            value={filters.kategori}
            onChange={handleInputChange}
            className={inputBaseStyle}
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelBaseStyle}>Rentang Tanggal Publikasi</label>
          <div className="flex flex-col gap-2">
            <DatePicker
              selectsRange={true}
              startDate={filters.tanggalMulai}
              endDate={filters.tanggalSelesai}
              onChange={handleDateChange}
              isClearable={true}
              placeholderText="Pilih tanggal mulai dan selesai"
              className={inputBaseStyle}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        {/* Bagian Penulis Baru */}
        <div>
          <label htmlFor="penulis" className={labelBaseStyle}>
            Penulis
          </label>

          <select
            id="penulis"
            name="penulis"
            value={filters.penulis}
            onChange={handleInputChange}
            className={inputBaseStyle}
          >
            <option value="">Semua Penulis</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="urutkan" className={labelBaseStyle}>
            Urutkan Berdasarkan
          </label>
          <div className="relative">
            <select
              id="urutkan"
              name="urutkan"
              value={filters.urutkan}
              onChange={handleInputChange}
              className={`${inputBaseStyle} appearance-none pr-8`}
            >
              <option value="terbaru">Terbaru</option>
              <option value="judul">Judul A-Z</option>
            </select>
            <ArrowDownUp
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Search size={16} /> Terapkan Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium px-4 py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} /> Reset
          </button>
        </div>
      </form>
    </aside>
  );
};

export default FilterSidebar;
