// components/Organisasi/DaftarPensiunTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import type { PegawaiDetail } from "@/types/pegawai";
import {
  ListFilter,
  Columns,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface DaftarPensiunTableProps {
  pegawaiList: PegawaiDetail[];
  title?: string;
}

const DaftarPensiunTable: React.FC<DaftarPensiunTableProps> = ({
  pegawaiList,
  title,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const calculateAge = (birthDate: Date | null): number | string => {
    if (!birthDate) return "-";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateRemainingWorkTime = (pensionDate: Date | null): string => {
    if (!pensionDate) return "-";
    const today = new Date();
    const diffTime = pensionDate.getTime() - today.getTime();
    if (diffTime < 0) return "Sudah Pensiun";

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = Math.floor((diffDays % 365) % 30);

    if (years > 0) return `${years} Thn ${months} Bln`;
    if (months > 0) return `${months} Bln ${days} Hari`;
    return `${days} Hari`;
  };

  // --- Logika Filter, Sort, dan Paginasi Menggunakan useMemo ---
  const processedAndFilteredPegawai = useMemo(() => {
    // 1. Proses data mentah dari API untuk mendapatkan umur, sisa masa kerja, dll.
    const processedData = pegawaiList.map((pegawai) => {
      // PERBAIKAN UTAMA: Konversi string tanggal dari API menjadi objek Date
      const tanggalLahirObj = pegawai.tanggal_lahir
        ? new Date(pegawai.tanggal_lahir)
        : null;
      const tanggalPensiunObj = pegawai.tanggal_pensiun
        ? new Date(pegawai.tanggal_pensiun)
        : null;

      const umur = calculateAge(tanggalLahirObj);
      const sisaMasaKerja = calculateRemainingWorkTime(tanggalPensiunObj);

      const avatarInitial = pegawai.nama_lengkap
        ? pegawai.nama_lengkap.substring(0, 1).toUpperCase()
        : "?";
      const avatarColor = "bg-purple-500";

      return {
        ...pegawai, // Pertahankan semua properti asli
        id: pegawai.user_id.toString(), // ID unik untuk key tabel (string)
        namaPegawai: pegawai.nama_lengkap || "-", // Fallback jika null
        satuanKerja:
          pegawai.unit_kerja_eselon2 || pegawai.unit_kerja_eselon1 || "-", // Fallback jika null
        tanggalLahirDisplay: tanggalLahirObj
          ? format(tanggalLahirObj, "dd MMMM yyyy", { locale: id }) // Format objek Date
          : "-",
        tmtPensiunDisplay: tanggalPensiunObj
          ? format(tanggalPensiunObj, "dd MMMM yyyy", { locale: id }) // Format objek Date
          : "-",
        umur: umur,
        sisaMasaKerja: sisaMasaKerja,
        avatarInitial: avatarInitial,
        avatarColor: avatarColor,
      };
    });

    // 2. Filter berdasarkan searchTerm
    let data = processedData;
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      data = data.filter(
        (pegawai) =>
          pegawai.namaPegawai.toLowerCase().includes(lowerSearchTerm) ||
          pegawai.satuanKerja.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // 3. Urutkan berdasarkan tanggal pensiun yang paling dekat
    // Yang tidak memiliki tanggal pensiun akan diurutkan di akhir
    data.sort((a, b) => {
      // PERBAIKAN: Pastikan a.tanggal_pensiun dan b.tanggal_pensiun adalah objek Date yang sudah dikonversi
      const dateA = a.tanggal_pensiun
        ? new Date(a.tanggal_pensiun).getTime()
        : Infinity;
      const dateB = b.tanggal_pensiun
        ? new Date(b.tanggal_pensiun).getTime()
        : Infinity;
      return dateA - dateB;
    });

    return data;
  }, [pegawaiList, searchTerm]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = processedAndFilteredPegawai.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(
    processedAndFilteredPegawai.length / rowsPerPage
  );

  const tableTitle =
    title ||
    `${processedAndFilteredPegawai.length} DAFTAR PEGAWAI AKAN PENSIUN`;

  const handleExportCSV = () => {
    const headers = [
      "Nama Pegawai",
      "Satuan Kerja",
      "Tanggal Lahir",
      "Umur",
      "TMT Pensiun",
      "Sisa Masa Kerja",
    ];
    const csvRows = [
      headers.join(","),
      ...processedAndFilteredPegawai.map((row) =>
        [
          `"${row.namaPegawai.replace(/"/g, '""')}"`,
          `"${row.satuanKerja.replace(/"/g, '""')}"`,
          row.tanggalLahirDisplay,
          row.umur,
          row.tmtPensiunDisplay,
          `"${row.sisaMasaKerja.replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
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
            size={16}
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
        </div>
      </div>
      {/* Filter Panel Placeholder */}
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
            <tr>
              {[
                "Nama Pegawai",
                "Satuan Kerja",
                "Tanggal Lahir",
                "Umur (Thn)",
                "TMT Pensiun",
                "Sisa Masa Kerja",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
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
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full ${pegawai.avatarColor} flex items-center justify-center text-white text-xs font-semibold mr-2.5 flex-shrink-0`}
                    >
                      {pegawai.avatarInitial}
                    </div>
                    <span className="truncate">{pegawai.namaPegawai}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate">
                  {pegawai.satuanKerja}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pegawai.tanggalLahirDisplay}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pegawai.umur}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pegawai.tmtPensiunDisplay}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pegawai.sisaMasaKerja}
                </td>
              </tr>
            ))}
            {processedAndFilteredPegawai.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
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
      {totalPages > 0 && (
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
            Menampilkan{" "}
            {processedAndFilteredPegawai.length > 0 ? indexOfFirstRow + 1 : 0}-
            {Math.min(indexOfLastRow, processedAndFilteredPegawai.length)} dari{" "}
            {processedAndFilteredPegawai.length} pegawai
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
