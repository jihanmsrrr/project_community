// src/components/Organisasi/DaftarPensiunTable.tsx
"use client";

import React, { useState } from "react";
import type { PegawaiPensiun } from "@/types/organisasi"; // Sesuaikan path jika perlu
import {
  ListFilter,
  Columns,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings2,
  X, // Untuk menutup filter panel
} from "lucide-react";

interface DaftarPensiunTableProps {
  pegawaiList: PegawaiPensiun[];
  title?: string;
}

const DaftarPensiunTable: React.FC<DaftarPensiunTableProps> = ({
  pegawaiList,
  title,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showFilterPanel, setShowFilterPanel] = useState(false); // State untuk filter panel

  // Logika filter berdasarkan searchTerm
  const filteredPegawai = pegawaiList.filter(
    (pegawai) =>
      pegawai.namaPegawai.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pegawai.satuanKerja.toLowerCase().includes(searchTerm.toLowerCase())
    // Anda bisa menambahkan kriteria filter lain di sini jika filter panel diimplementasikan lebih lanjut
  );

  // Logika paginasi
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredPegawai.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredPegawai.length / rowsPerPage);

  const tableTitle =
    title || `${filteredPegawai.length} DAFTAR PEGAWAI AKAN PENSIUN`;

  // Fungsi untuk Export ke CSV
  const handleExportCSV = () => {
    const headers = [
      "Nama Pegawai",
      "Satuan Kerja",
      "Tanggal Lahir",
      "Umur",
      "TMT Pensiun",
      "Sisa Masa Kerja",
    ];
    // Menggunakan filteredPegawai untuk mengekspor semua data yang telah difilter, bukan hanya yang di halaman saat ini
    const csvRows = [
      headers.join(","), // Header row
      ...filteredPegawai.map((row) =>
        [
          `"${row.namaPegawai.replace(/"/g, '""')}"`, // Handle double quotes in names
          `"${row.satuanKerja.replace(/"/g, '""')}"`,
          row.tanggalLahir,
          row.umur,
          row.tmtPensiun,
          `"${row.sisaMasaKerja.replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Check for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "daftar_pegawai_pensiun.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("Fitur download tidak didukung di browser ini.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6">
      {" "}
      {/* Shadow dan radius ditingkatkan */}
      <h2
        className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white"
        style={{ color: "#5A3D8A" }}
      >
        {tableTitle.toUpperCase()}
      </h2>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md transition-colors">
            <Columns size={14} className="mr-1.5" /> Columns
          </button>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md transition-colors"
          >
            <ListFilter size={14} className="mr-1.5" /> Filters
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            <Download size={14} className="mr-1.5" /> Export
          </button>
        </div>
        <div className="relative flex items-center gap-2 w-full sm:w-auto">
          <Search
            size={16} // Disesuaikan
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari Nama/Satker..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-4 py-1.5 w-full sm:w-60 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-shadow focus:shadow-md"
          />
          {/* Tombol Settings bisa Anda fungsikan nanti */}
          {/* <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Settings2 size={18} />
          </button> */}
        </div>
      </div>
      {/* Filter Panel Placeholder (muncul jika showFilterPanel true) */}
      {showFilterPanel && (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-md mb-4 shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
              Opsi Filter
            </h3>
            <button
              onClick={() => setShowFilterPanel(false)}
              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Tempat untuk opsi filter lanjutan akan muncul di sini. (Contoh:
            filter berdasarkan rentang umur, TMT Pensiun, dll.)
          </p>
          {/* Contoh input filter (belum berfungsi, hanya UI) */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="filter-umur"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Rentang Umur:
              </label>
              <input
                type="text"
                id="filter-umur"
                placeholder="cth: 50-55"
                className="mt-1 block w-full text-xs border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-600 dark:text-white p-1.5"
              />
            </div>
            <div>
              <label
                htmlFor="filter-tmt"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                TMT Pensiun (Tahun):
              </label>
              <input
                type="number"
                id="filter-tmt"
                placeholder="cth: 2025"
                className="mt-1 block w-full text-xs border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-600 dark:text-white p-1.5"
              />
            </div>
          </div>
        </div>
      )}
      {/* Tabel */}
      <div className="overflow-x-auto rounded-md border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            {" "}
            {/* Warna header tabel sedikit diubah */}
            <tr>
              {[
                "Nama Pegawai",
                "Satuan Kerja",
                "Tanggal Lahir",
                "Umur (Thn)", // Ditambahkan (Thn)
                "TMT Pensiun",
                "Sisa Masa Kerja",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" // Font lebih tebal
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentRows.map((pegawai) => (
              <tr
                key={pegawai.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                  {" "}
                  {/* Padding disesuaikan */}
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        pegawai.avatarColor || "bg-purple-500"
                      } flex items-center justify-center text-white text-xs font-semibold mr-2.5 flex-shrink-0`} // Fallback color
                    >
                      {pegawai.avatarInitial ||
                        pegawai.namaPegawai.substring(0, 1).toUpperCase()}{" "}
                      {/* Fallback initial */}
                    </div>
                    <span className="truncate">{pegawai.namaPegawai}</span>{" "}
                    {/* Truncate jika nama panjang */}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate">
                  {pegawai.satuanKerja}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pegawai.tanggalLahir}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pegawai.umur}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pegawai.tmtPensiun}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pegawai.sisaMasaKerja}
                </td>
              </tr>
            ))}
            {filteredPegawai.length === 0 && ( // Kondisi diubah ke filteredPegawai
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400" // Padding ditambah
                >
                  Tidak ada data pegawai yang akan pensiun{" "}
                  {searchTerm ? `dengan kata kunci "${searchTerm}".` : "."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginasi */}
      {totalPages > 0 && ( // Hanya tampilkan paginasi jika ada data
        <div className="py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 mt-4 text-xs text-gray-600 dark:text-gray-400 gap-2">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 text-center sm:text-left">
            Menampilkan {filteredPegawai.length > 0 ? indexOfFirstRow + 1 : 0}-
            {Math.min(indexOfLastRow, filteredPegawai.length)} dari{" "}
            {filteredPegawai.length} pegawai
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-1">
              Hal {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Halaman Berikutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarPensiunTable;
