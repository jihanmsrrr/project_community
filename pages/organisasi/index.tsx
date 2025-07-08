// pages/organisasi/index.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import PageTitle from "@/components/ui/PageTitle";
import StatsRow from "@/components/Organisasi/StatsRow";
import MapVisualizationCard from "@/components/Organisasi/MapVisualizationCard";
import ProvinceInfoPopup from "@/components/Organisasi/ProvinceInfoPopup";
import InformasiOrganisasi from "@/components/Organisasi/InformasiOrganisasi";
import DaftarPensiunTable from "@/components/Organisasi/DaftarPensiunTable";

import type { StatistikPetaData } from "@/pages/api/organisasi/statistik-peta";
import type { AggregatedUnitData, PegawaiDetail } from "@/types/pegawai";

const Organisasi: React.FC = () => {
  const router = useRouter();

  const [dataPeta, setDataPeta] = useState<StatistikPetaData[]>([]);
  const [selectedWilayahKey, setSelectedWilayahKey] = useState<string>("0000");
  const [displayedStats, setDisplayedStats] =
    useState<AggregatedUnitData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProvincePopupOpen, setIsProvincePopupOpen] = useState(false);
  const [daftarPegawaiPensiun, setDaftarPegawaiPensiun] = useState<
    PegawaiDetail[]
  >([]);

  // useEffect 1: Mengambil data awal (peta & statistik nasional)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsPageLoading(true);
      try {
        const [mapRes, nasionalRes] = await Promise.all([
          fetch("/api/organisasi/statistik-peta"),
          fetch("/api/organisasi/detail-unit/0000"),
        ]);
        if (!mapRes.ok || !nasionalRes.ok)
          throw new Error("Gagal memuat data awal organisasi.");
        const mapData: StatistikPetaData[] = await mapRes.json();
        const nasionalData: AggregatedUnitData = await nasionalRes.json();
        setDataPeta(mapData);
        setDisplayedStats(nasionalData);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan tidak diketahui.");
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // useEffect 2: Mengambil data detail provinsi saat dipilih
  useEffect(() => {
    if (selectedWilayahKey === "0000" || !selectedWilayahKey) {
      if (displayedStats?.id !== "0000" && !isPageLoading) {
        fetch("/api/organisasi/detail-unit/0000")
          .then((res) => res.json())
          .then((data) => setDisplayedStats(data));
      }
      return;
    }

    const fetchDetailUnit = async () => {
      setIsDetailLoading(true);
      try {
        const res = await fetch(
          `/api/organisasi/detail-unit/${selectedWilayahKey}`
        );
        if (!res.ok)
          throw new Error(`Gagal memuat detail untuk ${selectedWilayahKey}`);
        const detailData: AggregatedUnitData = await res.json();
        setDisplayedStats(detailData);
        setIsProvincePopupOpen(true);
      } catch (err) {
        if (err instanceof Error)
          setError(`Gagal memuat data provinsi: ${err.message}`);
        console.error(err);
      } finally {
        setIsDetailLoading(false);
      }
    };
    fetchDetailUnit();
  }, [displayedStats?.id, isPageLoading, selectedWilayahKey]);

  // useEffect 3: Mengambil data daftar pensiun secara terpisah
  useEffect(() => {
    const fetchDaftarPensiun = async () => {
      try {
        const res = await fetch("/api/organisasi/daftar-pensiun");
        if (!res.ok) return;
        const data = await res.json();
        setDaftarPegawaiPensiun(data);
      } catch (err) {
        console.error("Gagal mengambil data pensiun:", err);
      }
    };
    fetchDaftarPensiun();
  }, []);

  const handleMapProvinceClick = (
    provinceName: string,
    provinceCode: string
  ) => {
    setSelectedWilayahKey(provinceCode);
  };

  const handleCloseProvincePopup = () => {
    setIsProvincePopupOpen(false);
    setSelectedWilayahKey("0000");
  };

  const availableWilayahsForDropdown = useMemo(() => {
    const options = [{ id: "0000", nama: "Nasional" }];
    dataPeta.forEach((p) => options.push({ id: p.id, nama: p.label }));
    return options.sort((a, b) => a.nama.localeCompare(b.nama));
  }, [dataPeta]);

  const menuItems = [
    { label: "Peta & Statistik", path: "/organisasi" },
    { label: "Struktur Organisasi", path: "/organisasi/struktur" },
    { label: "Cari Pegawai", path: "/organisasi/pegawai" },
  ];

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Memuat Peta Organisasi...
      </div>
    );
  }

  if (error && !dataPeta.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
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
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md sticky top-16 z-40 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 py-2">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-menu-bg-active text-menu-text-active font-semibold"
                      : "text-menu-text hover:bg-menu-bg-hover hover:text-menu-text-hover"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto w-full px-4 py-8 flex-grow">
        <StatsRow
          stats={displayedStats}
          isLoading={isDetailLoading}
          wilayah={selectedWilayahKey}
          availableWilayahs={availableWilayahsForDropdown}
          onWilayahChange={setSelectedWilayahKey}
        />
        <div className="mt-8">
          <MapVisualizationCard
            onMapProvinceClickProp={handleMapProvinceClick}
            statistikDataForChoropleth={dataPeta.reduce((acc, item) => {
              acc[item.id] = {
                nilai: item.value,
                detail: `${item.value} Pegawai`,
              };
              return acc;
            }, {} as Record<string, { nilai: number; detail: string }>)}
          />
        </div>

        <ProvinceInfoPopup
          isOpen={isProvincePopupOpen}
          onClose={handleCloseProvincePopup}
          provinsiData={displayedStats || undefined}
          provinceCode={
            selectedWilayahKey !== "0000" ? selectedWilayahKey : undefined
          }
        />
      </main>

      <div className="py-8 md:py-12 bg-surface-page">
        <div className="max-w-screen-xl mx-auto px-4 space-y-8 md:space-y-12">
          <DaftarPensiunTable pegawaiList={daftarPegawaiPensiun} />
          <InformasiOrganisasi />
        </div>
      </div>
    </div>
  );
};

export default Organisasi;
