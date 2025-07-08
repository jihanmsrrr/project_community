// pages/organisasi.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import PageTitle from "@/components/ui/PageTitle";
import StatsRow from "@/components/Organisasi/StatsRow";
import MapVisualizationCard from "@/components/Organisasi/MapVisualizationCard";
import ProvinceInfoPopup from "@/components/Organisasi/ProvinceInfoPopup";
import DaftarPensiunTable from "@/components/Organisasi/DaftarPensiunTable";
import InformasiOrganisasi from "@/components/Organisasi/InformasiOrganisasi";

import type {
  StatistikData,
  PegawaiDetail,
  AggregatedUnitData,
  DashboardDataApi,
} from "@/types/pegawai";

type WilayahKey = string;

interface WilayahDropdownOption {
  id: WilayahKey;
  nama: string;
}

const Organisasi: React.FC = () => {
  const router = useRouter();

  // --- State untuk Data ---
  const [dataStatistikLengkapAPI, setDataStatistikLengkapAPI] = useState<{
    [key: string]: AggregatedUnitData;
  } | null>(null);
  const [daftarPegawaiPensiunAPI, setDaftarPegawaiPensiunAPI] = useState<
    PegawaiDetail[]
  >([]);
  const [dataUntukPetaAPI, setDataUntukPetaAPI] = useState<
    StatistikData | undefined
  >(undefined);

  // --- State untuk UI dan Loading ---
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Perubahan 1: Menggunakan '0000' sebagai kunci default untuk nasional
  const [selectedWilayahKey, setSelectedWilayahKey] =
    useState<WilayahKey>("0000");

  const [displayedStats, setDisplayedStats] =
    useState<AggregatedUnitData | null>(null);
  const [isProvincePopupOpen, setIsProvincePopupOpen] = useState(false);
  const [selectedProvinceDataForPopup, setSelectedProvinceDataForPopup] =
    useState<AggregatedUnitData | undefined>(undefined);
  const [selectedProvinceCodeForLink, setSelectedProvinceCodeForLink] =
    useState<string | undefined>(undefined);
  const [animationsDisabled, setAnimationsDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setFetchError(null);
      console.log("🚀 Memulai pengambilan data...");

      try {
        const response = await fetch("/api/organisasi/dashboard-data");
        console.log("✅ Respons API diterima:", response);

        if (!response.ok) {
          const errorText = `Gagal mengambil data: ${response.status} ${response.statusText}`;
          console.error("❌ Respons API tidak OK!", {
            status: response.status,
            statusText: response.statusText,
          });
          setFetchError(errorText);
          throw new Error(errorText);
        }

        const data: DashboardDataApi = await response.json();
        console.log("📊 Data JSON berhasil di-parse:", data);

        if (!data || !data.dataStatistikLengkap) {
          console.error("Struktur data tidak valid atau kosong.");
          setFetchError("Format data dari server tidak sesuai.");
          return;
        }

        setDataStatistikLengkapAPI(data.dataStatistikLengkap);
        setDaftarPegawaiPensiunAPI(data.daftarPegawaiPensiun || []);
        setDataUntukPetaAPI(data.dataUntukPeta);

        // Perubahan 2: Mengecek kunci '0000' untuk statistik default
        if (data.dataStatistikLengkap?.["0000"]) {
          setDisplayedStats(data.dataStatistikLengkap["0000"]);
        }

        console.log("👍 State berhasil diperbarui dengan data dari API.");
      } catch (error) {
        console.error(
          "🔥 Terjadi error saat mengambil data organisasi:",
          error
        );
        if (!fetchError) {
          setFetchError("Gagal terhubung ke server. Silakan coba lagi nanti.");
        }
        setDataStatistikLengkapAPI(null);
        setDaftarPegawaiPensiunAPI([]);
        setDataUntukPetaAPI(undefined);
        setDisplayedStats(null);
      } finally {
        console.log("🏁 Proses pengambilan data selesai.");
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [fetchError]); // Perbaikan: Dependensi harus kosong agar hanya berjalan sekali saat komponen mount

  useEffect(() => {
    if (dataStatistikLengkapAPI) {
      const newStats = dataStatistikLengkapAPI[selectedWilayahKey];
      if (newStats) {
        setDisplayedStats(newStats);
      } else if (dataStatistikLengkapAPI["0000"]) {
        // Perubahan 3: Fallback ke '0000'
        setDisplayedStats(dataStatistikLengkapAPI["0000"]);
      } else {
        setDisplayedStats(null);
      }
    }
  }, [selectedWilayahKey, dataStatistikLengkapAPI]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnimationsDisabled(
        document.documentElement.classList.contains("animations-disabled")
      );
    }
  }, []);

  const availableWilayahsForDropdown: WilayahDropdownOption[] = useMemo(() => {
    if (!dataStatistikLengkapAPI) return [];
    return (Object.keys(dataStatistikLengkapAPI) as WilayahKey[])
      .map((key) => ({
        id: key,
        nama: dataStatistikLengkapAPI[key].namaWilayahAsli || key,
      }))
      .sort((a, b) => {
        if (a.id === "0000") return -1;
        if (b.id === "0000") return 1;
        return a.nama.localeCompare(b.nama);
      });
  }, [dataStatistikLengkapAPI]);

  const handleMapProvinceClick = (
    _provinceName: string,
    provinceCode: string
  ) => {
    if (dataStatistikLengkapAPI && provinceCode in dataStatistikLengkapAPI) {
      const key = provinceCode as WilayahKey;
      const provinsiData: AggregatedUnitData = dataStatistikLengkapAPI[key];
      if (provinsiData) {
        setSelectedWilayahKey(key);
        setSelectedProvinceDataForPopup(provinsiData);
        setSelectedProvinceCodeForLink(key);
        setIsProvincePopupOpen(true);
      }
    } else {
      const fallbackKey = dataStatistikLengkapAPI?.["0000"]
        ? "0000"
        : dataStatistikLengkapAPI
        ? Object.keys(dataStatistikLengkapAPI)[0]
        : "0000";
      setSelectedWilayahKey(fallbackKey);
      setIsProvincePopupOpen(false);
    }
  };

  const handleStatsRowWilayahChange = (newWilayahKey: string) => {
    if (dataStatistikLengkapAPI && newWilayahKey in dataStatistikLengkapAPI) {
      setSelectedWilayahKey(newWilayahKey as WilayahKey);
    }
  };

  const handleCloseProvincePopup = () => {
    setIsProvincePopupOpen(false);
    setTimeout(() => {
      setSelectedProvinceDataForPopup(undefined);
      setSelectedProvinceCodeForLink(undefined);
    }, 300);
  };

  const menuButtonBaseStyle =
    "py-3 px-4 sm:px-6 rounded-lg text-primary font-poppins text-sm sm:text-base text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-page text-text-secondary">
        <p>Memuat data organisasi...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-page text-text-danger">
        <p>{fetchError}</p>
      </div>
    );
  }

  if (
    !dataStatistikLengkapAPI ||
    Object.keys(dataStatistikLengkapAPI).length === 0 ||
    !displayedStats
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-page text-text-secondary">
        <p>Data statistik organisasi belum tersedia.</p>
      </div>
    );
  }

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
                  className={`${menuButtonBaseStyle} ${
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

export default Organisasi;
