// components/Organisasi/MapVisualizationCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type {
  StatistikData,
  ProvinceProperties,
} from "@/components/Organisasi/maps/IndonesiaLeafletMap";
import type { FeatureCollection, Geometry } from "geojson";

interface MapVisualizationCardProps {
  onMapProvinceClickProp: (provinceName: string, provinceCode: string) => void;
  statistikDataForChoropleth?: StatistikData;
  activeSelectedCode?: string | null;
}

const IndonesiaMapWithNoSSR = dynamic(
  () => import("@/components/Organisasi/maps/IndonesiaLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-page rounded-lg select-none">
        <svg
          className="animate-spin h-8 w-8 text-brand-primary mb-3"
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
    ),
  }
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
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeojsonData = async () => {
      setIsLoading(true);
      setErrorLoading(null);
      try {
        const response = await fetch("/data/provinsi.json");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Gagal memuat GeoJSON: ${
              response.status
            }. Detail: ${errorText.substring(0, 150)}`
          );
        }
        const data = (await response.json()) as FeatureCollection<
          Geometry,
          ProvinceProperties
        >;
        setGeojsonData(data);
      } catch (err: unknown) {
        console.error("Terjadi kesalahan saat mengambil data GeoJSON:", err);
        if (err instanceof Error) {
          setErrorLoading(err.message);
        } else {
          setErrorLoading("Kesalahan tidak diketahui saat memuat data peta.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeojsonData();
  }, []);

  const handleMapInteraction = (provinceName: string, provinceCode: string) => {
    onMapProvinceClickProp(provinceName, provinceCode);
  };

  return (
    <div className="bg-surface-card rounded-xl shadow-lg p-4 sm:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-text-primary">
          Pilih Satuan Kerja via Peta
        </h3>
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <MapPin size={14} />
          <span>Indonesia</span>
        </div>
      </div>

      <div className="flex-grow min-h-[300px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[450px] relative rounded-md overflow-hidden bg-ui-border/10">
        {isLoading && !geojsonData && !errorLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-page rounded-lg select-none">
            <svg
              className="animate-spin h-8 w-8 text-brand-primary mb-3"
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
            <p className="text-sm text-text-secondary">
              Memuat Peta Indonesia...
            </p>
          </div>
        )}
        {errorLoading && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-feedback-error-bg text-feedback-error-text rounded-lg">
            <p>{errorLoading}</p>
          </div>
        )}
        {!isLoading && !errorLoading && geojsonData && (
          <IndonesiaMapWithNoSSR
            geojsonData={geojsonData}
            statistikData={statistikDataForChoropleth}
            onProvinceClick={handleMapInteraction}
            height="100%"
            selectedProvinceCode={activeSelectedCode}
          />
        )}
      </div>

      <p className="text-xs text-text-secondary text-center mt-3 sm:mt-4">
        Klik pada provinsi pada peta untuk melihat detail struktur organisasi.
      </p>
    </div>
  );
};

export default MapVisualizationCard;
