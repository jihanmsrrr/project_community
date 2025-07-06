// pages/organisasi.tsx
"use client"; // Ini menandakan komponen ini adalah Client Component di Next.js 13+

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router"; // Menggunakan next/router untuk Pages Router

// Import komponen UI dasar dan layout (hapus MainLayout)
import PageTitle from "@/components/ui/PageTitle";
// import MainLayout from "@/components/ui/MainLayout"; // HAPUS BARIS INI
// Hapus juga import NextPageWithLayout jika tidak digunakan di file ini lagi
// import type { NextPageWithLayout } from "./_app";

// Import komponen khusus halaman organisasi
import StatsRow from "@/components/Organisasi/StatsRow";
import MapVisualizationCard from "@/components/Organisasi/MapVisualizationCard";
import ProvinceInfoPopup from "@/components/Organisasi/ProvinceInfoPopup";
import DaftarPensiunTable from "@/components/Organisasi/DaftarPensiunTable";
import InformasiOrganisasi from "@/components/Organisasi/InformasiOrganisasi";

// Import tipe data yang telah disesuaikan
// PERBAIKAN: Pastikan AggregatedUnitData juga diimpor di sini
import type {
  StatistikData,
  PegawaiDetail,
  AggregatedUnitData, // <-- PASTIKAN INI DIIMPOR
  DashboardDataApi, // <-- PASTIKAN INI DIIMPOR JUGA
} from "@/types/pegawai";

// Definisi tipe untuk WilayahKey (kode BPS atau 'nasional')
type WilayahKey = string;

// Definisi tipe untuk opsi dropdown wilayah
interface WilayahDropdownOption {
  id: WilayahKey;
  nama: string;
}

// Komponen utama halaman Organisasi
const Organisasi: React.FC = () => {
  const router = useRouter();

  // State untuk data yang diambil dari API
  // PERBAIKAN UTAMA: dataStatistikLengkapAPI seharusnya bertipe AggregatedUnitData
  const [dataStatistikLengkapAPI, setDataStatistikLengkapAPI] = useState<{
    [key: string]: AggregatedUnitData; // <-- GANTI DARI DetailPegawaiData ke AggregatedUnitData
  } | null>(null);
  const [daftarPegawaiPensiunAPI, setDaftarPegawaiPensiunAPI] = useState<
    PegawaiDetail[]
  >([]);
  const [dataUntukPetaAPI, setDataUntukPetaAPI] = useState<
    StatistikData | undefined
  >(undefined);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // State untuk tampilan UI
  const [selectedWilayahKey, setSelectedWilayahKey] =
    useState<WilayahKey>("nasional");
  // PERBAIKAN: displayedStats juga harus AggregatedUnitData
  const [displayedStats, setDisplayedStats] =
    useState<AggregatedUnitData | null>(null);
  const [isProvincePopupOpen, setIsProvincePopupOpen] = useState(false);
  // PERBAIKAN: selectedProvinceDataForPopup juga harus AggregatedUnitData
  const [selectedProvinceDataForPopup, setSelectedProvinceDataForPopup] =
    useState<AggregatedUnitData | undefined>(undefined);
  const [selectedProvinceCodeForLink, setSelectedProvinceCodeForLink] =
    useState<string | undefined>(undefined);
  const [animationsDisabled, setAnimationsDisabled] = useState(false); // Untuk kontrol animasi, jika ada

  // --- Fungsi Pengambilan Data dari API ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true); // Set loading ke true sebelum fetching
      try {
        const response = await fetch("/api/organisasi/dashboard-data"); // Panggil API Route yang sudah dibuat
        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data organisasi: ${response.status} ${response.statusText}`
          );
        }

        // PERBAIKAN: Pastikan response JSON divalidasi sebagai DashboardDataApi
        const data: DashboardDataApi = await response.json(); // Data API harus sesuai dengan DashboardDataApi

        // Simpan data mentah dari API ke state
        // data.dataStatistikLengkap sekarang sudah bertipe { [key: string]: AggregatedUnitData }
        setDataStatistikLengkapAPI(data.dataStatistikLengkap);
        setDaftarPegawaiPensiunAPI(data.daftarPegawaiPensiun);
        setDataUntukPetaAPI(data.dataUntukPeta);

        // Atur statistik yang ditampilkan awalnya ke data Nasional
        if (data.dataStatistikLengkap?.nasional) {
          setDisplayedStats(data.dataStatistikLengkap.nasional);
        }
      } catch (error) {
        console.error("Error saat mengambil data organisasi:", error);
        // Set state ke nilai default/kosong jika terjadi error
        setDataStatistikLengkapAPI(null);
        setDaftarPegawaiPensiunAPI([]);
        setDataUntukPetaAPI(undefined);
        setDisplayedStats(null);
      } finally {
        setIsLoadingData(false); // Set loading ke false setelah fetching selesai
      }
    };

    fetchData(); // Panggil fungsi fetching data saat komponen pertama kali di-mount
  }, []); // Dependency array kosong agar hanya berjalan sekali (client-side rendering)

  // --- Efek Samping untuk Memperbarui Statistik Tampilan ---
  useEffect(() => {
    if (dataStatistikLengkapAPI) {
      // Pastikan data API sudah dimuat
      const newStats = dataStatistikLengkapAPI[selectedWilayahKey]; // Coba ambil data untuk wilayah yang dipilih
      if (newStats) {
        setDisplayedStats(newStats); // Jika ada, update statistik yang ditampilkan
      } else if (dataStatistikLengkapAPI.nasional) {
        // Fallback ke data Nasional jika wilayah yang dipilih tidak ditemukan
        setDisplayedStats(dataStatistikLengkapAPI.nasional);
      } else {
        // Jika bahkan data Nasional tidak ada, set ke null
        setDisplayedStats(null);
      }
    }
  }, [selectedWilayahKey, dataStatistikLengkapAPI]); // Berjalan saat selectedWilayahKey atau data API berubah

  // --- Efek Samping untuk Animasi (Jika ada) ---
  useEffect(() => {
    // Mengecek apakah window sudah tersedia (untuk menghindari error saat Server-Side Rendering)
    if (typeof window !== "undefined") {
      setAnimationsDisabled(
        document.documentElement.classList.contains("animations-disabled")
      );
    }
  }, []); // Hanya berjalan sekali

  // --- Memoized Dropdown Options untuk Wilayah ---
  const availableWilayahsForDropdown: WilayahDropdownOption[] = useMemo(() => {
    if (!dataStatistikLengkapAPI) return []; // Jika data API belum ada, kembalikan array kosong

    return (Object.keys(dataStatistikLengkapAPI) as WilayahKey[]) // Ambil kunci objek dan cast ke WilayahKey
      .map((key) => ({
        id: key,
        nama: dataStatistikLengkapAPI[key].namaWilayahAsli, // Ambil nama asli dari data API
      }))
      .sort((a, b) => {
        // Urutkan: Nasional paling atas, sisanya berdasarkan nama
        if (a.id === "nasional") return -1;
        if (b.id === "nasional") return 1;
        return a.nama.localeCompare(b.nama);
      });
  }, [dataStatistikLengkapAPI]); // Di-recalculate jika data API berubah

  // --- Handler Klik Provinsi di Peta ---
  const handleMapProvinceClick = (
    _provinceNameFromMap: string, // Nama provinsi dari peta (tidak digunakan di sini)
    provinceCodeFromMap: string // Kode provinsi dari peta (sesuai kode_bps)
  ) => {
    if (
      dataStatistikLengkapAPI &&
      provinceCodeFromMap in dataStatistikLengkapAPI
    ) {
      const key = provinceCodeFromMap as WilayahKey; // Pastikan tipe kunci wilayah
      // PERBAIKAN: ProvinsiData sekarang AggregatedUnitData
      const provinsiData: AggregatedUnitData = dataStatistikLengkapAPI[key];
      if (provinsiData) {
        setSelectedWilayahKey(key); // Update wilayah yang dipilih
        setSelectedProvinceDataForPopup(provinsiData); // Data untuk popup
        setSelectedProvinceCodeForLink(key); // Kode untuk link
        setIsProvincePopupOpen(true); // Buka popup
      }
    } else {
      // Jika kode provinsi dari peta tidak valid atau data tidak ada, reset ke nasional atau tutup popup
      if (dataStatistikLengkapAPI?.nasional) {
        setSelectedWilayahKey("nasional"); // Default ke nasional jika provinsi tidak ditemukan
      }
      setIsProvincePopupOpen(false);
    }
  };

  // --- Handler Perubahan Wilayah dari StatsRow (Dropdown) ---
  const handleStatsRowWilayahChange = (newWilayahKey: string) => {
    if (dataStatistikLengkapAPI && newWilayahKey in dataStatistikLengkapAPI) {
      setSelectedWilayahKey(newWilayahKey as WilayahKey);
    }
  };

  // --- Handler Tutup Popup Provinsi ---
  const handleCloseProvincePopup = () => {
    setIsProvincePopupOpen(false);
    // Timeout untuk memberi waktu animasi popup selesai sebelum mereset data
    setTimeout(() => {
      setSelectedProvinceDataForPopup(undefined);
      setSelectedProvinceCodeForLink(undefined);
    }, 300);
  };

  // Gaya dasar untuk tombol navigasi menu
  const menuButtonBaseStyle =
    "py-3 px-4 sm:px-6 rounded-lg text-primary font-poppins text-sm sm:text-base text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  // --- Kondisi Loading ---
  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-page text-text-secondary">
        <p>Memuat data organisasi...</p>
      </div>
    );
  }

  // --- Kondisi Error (Data Gagal Dimuat) ---
  if (!dataStatistikLengkapAPI || !displayedStats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-page text-text-danger">
        <p>Gagal memuat data organisasi. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // --- Render Halaman Setelah Data Dimuat ---
  return (
    <div className="bg-surface-page min-h-screen flex flex-col">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4">
          <PageTitle
            title="Organisasi BPS Community"
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
        <div className="relative z-10"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md sticky top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center py-3 sm:py-4">
            {[
              { label: "Peta & Statistik", path: "/organisasi" },
              { label: "Struktur Organisasi", path: "/organisasi/struktur" },
              { label: "Cari Pegawai", path: "/organisasi/pegawai" },
            ].map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`${menuButtonBaseStyle}
                    ${
                      isActive
                        ? "bg-[#adcbe3] dark:bg-[#8ab6d6] font-semibold shadow-md ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-blue-500 dark:ring-sky-400"
                        : "bg-[#e0eaf4] dark:bg-slate-700 font-medium hover:bg-[#d0ddeb] dark:hover:bg-slate-600 shadow-sm"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
        <StatsRow
          stats={displayedStats}
          wilayah={selectedWilayahKey}
          availableWilayahs={availableWilayahsForDropdown}
          onWilayahChange={handleStatsRowWilayahChange}
        />
        <div className="mt-6 md:mt-8 grid grid-cols-1 items-start">
          <div className="h-full">
            <MapVisualizationCard
              onMapProvinceClickProp={handleMapProvinceClick}
              statistikDataForChoropleth={dataUntukPetaAPI}
            />
          </div>
        </div>
        <ProvinceInfoPopup
          isOpen={isProvincePopupOpen}
          onClose={handleCloseProvincePopup}
          provinsiData={selectedProvinceDataForPopup}
          provinceCode={selectedProvinceCodeForLink}
          animationsDisabled={animationsDisabled}
        />
      </div>

      <div className="py-8 md:py-12 bg-surface-page">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
          <DaftarPensiunTable pegawaiList={daftarPegawaiPensiunAPI} />
          <InformasiOrganisasi />
        </div>
      </div>
    </div>
  );
};

// Hapus fungsi getLayout jika tidak ingin menggunakan layout khusus di level halaman ini
// Organisasi.getLayout = function getLayout(page: ReactElement) {
//   return <MainLayout>{page}</MainLayout>;
// };

export default Organisasi;
