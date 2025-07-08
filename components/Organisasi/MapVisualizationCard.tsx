// components/Organisasi/MapVisualizationCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { StatistikData } from "@/types/pegawai";
import type { FeatureCollection, Geometry } from "geojson";

// Tipe properti untuk GeoJSON Anda
export interface ProvinceProperties {
  id: string;
  name: string;
}

interface MapVisualizationCardProps {
  onMapProvinceClickProp: (provinceName: string, provinceCode: string) => void;
  statistikDataForChoropleth?: StatistikData;
  activeSelectedCode?: string | null;
}

// Impor dinamis komponen peta
const IndonesiaMapWithNoSSR = dynamic(
  () => import("@/components/Organisasi/maps/IndonesiaLeafletMap"),
  { ssr: false }
);

// Komponen untuk tampilan loading
const MapLoadingSkeleton = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg select-none">
    <svg
      className="animate-spin h-8 w-8 text-brand-text mb-3"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p className="text-sm text-text-secondary">Memuat Peta Indonesia...</p>
  </div>
);

const MapVisualizationCard: React.FC<MapVisualizationCardProps> = ({
  onMapProvinceClickProp,
  statistikDataForChoropleth,
  activeSelectedCode,
}) => {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection<
    Geometry,
    ProvinceProperties
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGeoData = async () => {
      setIsLoading(true);
      try {
        // Panggil file dari path yang benar (relatif terhadap folder public)
        const response = await fetch("/data/provinsi.json");
        if (!response.ok) {
          throw new Error(
            `Gagal memuat data peta (status: ${response.status}). Pastikan file ada di public/data/provinsi.json`
          );
        }
        const data = await response.json();
        setGeojsonData(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan saat memuat peta.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGeoData();
  }, []);

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-lg p-4 sm:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-text-primary">
          Pilih Satuan Kerja via Peta
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin size={14} />
          <span>Indonesia</span>
        </div>
      </div>

      <div className="flex-grow min-h-[450px] relative rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700/50">
        {isLoading && <MapLoadingSkeleton />}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-red-100 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && geojsonData && (
          <IndonesiaMapWithNoSSR
            geojsonData={geojsonData}
            statistikData={statistikDataForChoropleth}
            onProvinceClick={onMapProvinceClickProp}
            selectedProvinceCode={activeSelectedCode}
          />
        )}
      </div>

      <p className="text-xs text-text-secondary text-center mt-4">
        Klik pada provinsi untuk melihat detail statistik.
      </p>
    </div>
  );
};

export default MapVisualizationCard;
