// pages/organisasi.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router"; // Using next/router for Pages Router

import PageTitle from "@/components/ui/PageTitle";
import StatsRow from "@/components/Organisasi/StatsRow"; // Assuming StatsRowProps expects string for wilayah and id in availableWilayahs
import MapVisualizationCard from "@/components/Organisasi/MapVisualizationCard";
import ProvinceInfoPopup from "@/components/Organisasi/ProvinceInfoPopup";
import DaftarPensiunTable from "@/components/Organisasi/DaftarPensiunTable";
import InformasiOrganisasi from "@/components/Organisasi/InformasiOrganisasi";

import type { DetailPegawaiData } from "@/types/pegawai";
import type { StatistikData as StatistikPeta } from "@/components/Organisasi/maps/IndonesiaLeafletMap";

// Import DataStatistikNasional to correctly type WilayahKey
import {
  dataStatistikLengkap,
  DataStatistikNasional,
} from "@/data/statistikProvinsi";
import { daftarPegawaiPensiun } from "@/data/dummyPensiun";

// Refined WilayahKey to ensure it's a string type
// This will resolve to "nasional" | string, which is assignable to string.
type WilayahKey = Extract<keyof DataStatistikNasional, string>;

interface WilayahDropdownOption {
  id: WilayahKey; // Now correctly typed as a string subtype
  nama: string;
}

const Organisasi: React.FC = () => {
  const router = useRouter();

  const [selectedWilayahKey, setSelectedWilayahKey] =
    useState<WilayahKey>("nasional");

  const [displayedStats, setDisplayedStats] = useState<DetailPegawaiData>(
    dataStatistikLengkap.nasional
  );
  const [dataUntukPeta, setDataUntukPeta] = useState<
    StatistikPeta | undefined
  >();
  const [isProvincePopupOpen, setIsProvincePopupOpen] = useState(false);
  const [selectedProvinceDataForPopup, setSelectedProvinceDataForPopup] =
    useState<DetailPegawaiData | undefined>(undefined);

  // selectedProvinceCodeForLink expects string | undefined, WilayahKey is assignable to string
  const [selectedProvinceCodeForLink, setSelectedProvinceCodeForLink] =
    useState<string | undefined>(undefined);

  const [animationsDisabled, setAnimationsDisabled] = useState(false);

  useEffect(() => {
    const newStats = dataStatistikLengkap[selectedWilayahKey];
    if (newStats) {
      setDisplayedStats(newStats);
    } else {
      setDisplayedStats(dataStatistikLengkap.nasional);
    }
  }, [selectedWilayahKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnimationsDisabled(
        document.documentElement.classList.contains("animations-disabled")
      );
    }
    const petaStats: StatistikPeta = {};
    for (const kodeProv in dataStatistikLengkap) {
      // Ensure that kodeProv is treated as a WilayahKey.
      // Object.keys returns string[], so we need to be careful if WilayahKey is more specific.
      // However, since WilayahKey is now "nasional" | string, string keys from dataStatistikLengkap are fine.
      const key = kodeProv as WilayahKey;
      if (key !== "nasional" && dataStatistikLengkap[key]) {
        const satkerData = dataStatistikLengkap[key];
        if (typeof satkerData.persenTerhadapABK === "number") {
          petaStats[key] = {
            nilai: satkerData.persenTerhadapABK,
            detail: `ABK: ${satkerData.persenTerhadapABK.toFixed(2)}%`,
          };
        }
      }
    }
    setDataUntukPeta(petaStats);
  }, []);

  const availableWilayahsForDropdown: WilayahDropdownOption[] = useMemo(() => {
    // Object.keys returns string[]. Each key should be a valid WilayahKey.
    return (Object.keys(dataStatistikLengkap) as WilayahKey[])
      .map((key) => ({
        id: key,
        nama: dataStatistikLengkap[key].namaWilayahAsli,
      }))
      .sort((a, b) => {
        if (a.id === "nasional") return -1;
        if (b.id === "nasional") return 1;
        return a.nama.localeCompare(b.nama);
      });
  }, []);

  const handleMapProvinceClick = (
    _provinceNameFromMap: string,
    provinceCodeFromMap: string
  ) => {
    // Assuming provinceCodeFromMap from the map component is a string that matches one of our WilayahKeys
    if (provinceCodeFromMap in dataStatistikLengkap) {
      const key = provinceCodeFromMap as WilayahKey;
      const provinsiData = dataStatistikLengkap[key];
      // No need to check provinsiData again due to "in" check, but TS might not infer it fully without explicit non-null assertion or check
      if (provinsiData) {
        setSelectedWilayahKey(key);
        setSelectedProvinceDataForPopup(provinsiData);
        // 'key' is WilayahKey, which is assignable to string. This should fix Error 1.
        setSelectedProvinceCodeForLink(key);
        setIsProvincePopupOpen(true);
      }
    } else {
      setSelectedWilayahKey("nasional");
      setIsProvincePopupOpen(false);
    }
  };

  const handleStatsRowWilayahChange = (newWilayahKey: string) => {
    if (newWilayahKey in dataStatistikLengkap) {
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
          // selectedWilayahKey is WilayahKey, which is assignable to string. This should fix Error 2.
          stats={displayedStats}
          wilayah={selectedWilayahKey}
          // availableWilayahsForDropdown has id: WilayahKey, assignable to string. This should fix Error 3.
          availableWilayahs={availableWilayahsForDropdown}
          onWilayahChange={handleStatsRowWilayahChange}
        />
        <div className="mt-6 md:mt-8 grid grid-cols-1 items-start">
          <div className="h-full">
            <MapVisualizationCard
              onMapProvinceClickProp={handleMapProvinceClick}
              statistikDataForChoropleth={dataUntukPeta}
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
          <DaftarPensiunTable pegawaiList={daftarPegawaiPensiun} />
          <InformasiOrganisasi />
        </div>
      </div>
    </div>
  );
};

export default Organisasi;
