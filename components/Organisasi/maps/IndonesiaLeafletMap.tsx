// components/Organisasi/maps/IndonesiaLeafletMap.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L, {
  LatLngExpression,
  LeafletMouseEvent,
  Layer,
  PathOptions,
} from "leaflet";

// Tipe untuk properti fitur GeoJSON provinsi Anda
export interface ProvinceProperties {
  id: string; // Ini harus cocok dengan key di GeoJSON Anda, misal "IDAC", "IDJB"
  name: string; // Ini harus cocok dengan key nama provinsi di GeoJSON Anda
  NILAI_STATISTIK?: number; // Opsional, jika data nilai ada langsung di GeoJSON
  [key: string]: unknown; // Untuk properti lain yang tidak didefinisikan secara eksplisit
}

// Tipe untuk data statistik yang Anda kirim sebagai prop
export interface ProvinceStatistic {
  nilai: number; // Nilai yang akan menentukan warna choropleth
  detail?: string; // Detail tambahan untuk popup atau penggunaan lain
}

export interface StatistikData {
  [provinceCode: string]: ProvinceStatistic; // Kunci adalah kode provinsi (misal "IDAC")
}

// Tipe untuk prop komponen peta utama
interface IndonesiaMapProps {
  geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry, ProvinceProperties>;
  statistikData?: StatistikData; // Data untuk pewarnaan choropleth
  onProvinceClick?: (
    provinceName: string,
    provinceCode: string,
    data?: ProvinceStatistic // Data statistik untuk provinsi yang diklik
  ) => void;
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
  selectedProvinceCode?: string | null; // Kode provinsi yang sedang dipilih/aktif
}

// Fallback warna jika variabel CSS tidak ditemukan atau saat SSR awal
// Format: "R,G,B" (koma sebagai pemisah)
const initialThemeColors = {
  brandPrimaryRGB: "1,43,106", // Sesuai --brand-primary :root Anda
  uiBorderRGB: "229,230,235", // Sesuai --ui-border :root Anda
  textPrimaryRGB: "7,10,14", // Sesuai --text-primary :root Anda
  // Warna skala default untuk tema light (sesuaikan dengan :root Anda)
  colorScaleLowRGB: "224,231,255", // Contoh: Seperti indigo-100
  colorScaleMidRGB: "165,180,252", // Contoh: Seperti indigo-300
  colorScaleHighRGB: "99,102,241", // Contoh: Seperti indigo-500
};

const IndonesiaMap: React.FC<IndonesiaMapProps> = ({
  geojsonData,
  statistikData,
  onProvinceClick,
  center = [-2.2, 119.5], // Titik tengah Indonesia disesuaikan
  zoom = 4.8, // Zoom awal disesuaikan
  height = "100%", // Default mengisi tinggi parent
  selectedProvinceCode,
}) => {
  const [themeColors, setThemeColors] = useState(initialThemeColors);
  const [mapReady, setMapReady] = useState(false);

  // Fungsi untuk mengambil dan menerapkan warna tema
  const fetchAndSetThemeColors = useCallback(() => {
    if (typeof window !== "undefined") {
      const computedStyle = getComputedStyle(document.documentElement);
      const parseRGB = (cssVar: string, fallback: string) => {
        const value = computedStyle.getPropertyValue(cssVar).trim();
        if (value) {
          const parts = value.match(/\d+/g); // Mengambil semua grup angka
          if (parts && parts.length === 3) {
            return parts.join(","); // Menghasilkan "R,G,B"
          }
        }
        console.warn(
          `Variabel CSS ${cssVar} tidak ditemukan atau formatnya salah, menggunakan fallback: ${fallback}`
        );
        return fallback;
      };

      // console.log("Map: (Re)fetching theme colors...");
      setThemeColors({
        brandPrimaryRGB: parseRGB(
          "--brand-primary",
          initialThemeColors.brandPrimaryRGB
        ),
        uiBorderRGB: parseRGB("--ui-border", initialThemeColors.uiBorderRGB),
        textPrimaryRGB: parseRGB(
          "--text-primary",
          initialThemeColors.textPrimaryRGB
        ),
        colorScaleLowRGB: parseRGB(
          "--color-scale-low",
          initialThemeColors.colorScaleLowRGB
        ),
        colorScaleMidRGB: parseRGB(
          "--color-scale-medium",
          initialThemeColors.colorScaleMidRGB
        ),
        colorScaleHighRGB: parseRGB(
          "--color-scale-high",
          initialThemeColors.colorScaleHighRGB
        ),
      });
    }
    // Hanya set mapReady sekali setelah pengambilan warna pertama berhasil
    // atau jika memang belum ready. MutationObserver akan memicu update themeColors
    // yang kemudian akan memicu re-render GeoJSON via key.
    if (!mapReady) {
      setMapReady(true);
    }
  }, [mapReady]); // mapReady ada di sini agar bisa di-set false dari observer untuk memicu update

  // Setup MutationObserver untuk deteksi perubahan tema
  useEffect(() => {
    fetchAndSetThemeColors(); // Panggil saat mount untuk warna tema awal

    let observer: MutationObserver | null = null;
    if (typeof window !== "undefined" && window.MutationObserver) {
      observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            // console.log('Map: HTML class changed, re-fetching theme colors.');
            // Tidak perlu setMapReady(false) di sini jika geoJsonKey sudah benar menangani perubahan themeColors
            fetchAndSetThemeColors();
            break;
          }
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [fetchAndSetThemeColors]); // Dependensi ke fetchAndSetThemeColors yang di-memoize

  const getProvinceStyle = useCallback(
    (
      feature?: GeoJSON.Feature<GeoJSON.Geometry, ProvinceProperties>
    ): PathOptions => {
      let fillColor = `rgba(${themeColors.uiBorderRGB}, 0.2)`; // Warna isian default yang lebih netral
      const provinceCodeFromFeature = feature?.properties?.id;

      // 1. Style untuk provinsi yang terpilih (selectedProvinceCode)
      if (
        provinceCodeFromFeature &&
        provinceCodeFromFeature === selectedProvinceCode
      ) {
        return {
          fillColor: `rgb(${themeColors.brandPrimaryRGB})`,
          weight: 2.5,
          opacity: 1,
          color: `rgb(${themeColors.brandPrimaryRGB})`,
          fillOpacity: 0.85, // Lebih opak untuk yang terpilih
        };
      }

      // 2. Style untuk pewarnaan choropleth berdasarkan statistikData
      if (
        statistikData &&
        provinceCodeFromFeature &&
        statistikData[provinceCodeFromFeature]
      ) {
        const value = statistikData[provinceCodeFromFeature].nilai;
        if (value > 75) fillColor = `rgb(${themeColors.colorScaleHighRGB})`;
        else if (value > 50)
          fillColor = `rgba(${themeColors.colorScaleMidRGB}, 0.8)`;
        else if (value > 25)
          fillColor = `rgba(${themeColors.colorScaleLowRGB}, 0.7)`;
        else if (value >= 0)
          fillColor = `rgba(${themeColors.colorScaleLowRGB}, 0.4)`;
      } else if (feature?.properties?.NILAI_STATISTIK) {
        const value = feature.properties.NILAI_STATISTIK;
        if (value > 75) fillColor = `rgb(${themeColors.colorScaleHighRGB})`;
        // ... (logika pewarnaan lainnya dari NILAI_STATISTIK jika ada) ...
      }

      return {
        fillColor: fillColor,
        weight: 0.6,
        opacity: 1,
        color: `rgba(${themeColors.uiBorderRGB}, 0.5)`,
        fillOpacity: 0.65,
      };
    },
    [statistikData, themeColors, selectedProvinceCode] // Tambahkan selectedProvinceCode
  );

  const onEachProvinceFeature = (
    feature: GeoJSON.Feature<GeoJSON.Geometry, ProvinceProperties>,
    layer: Layer
  ) => {
    const provinceCode = feature.properties.id;
    const provinceName = feature.properties.name;
    const currentData =
      statistikData && provinceCode ? statistikData[provinceCode] : undefined;

    const tooltipContent = `<strong class="map-tooltip-title">${
      provinceName || "Nama Wilayah Tidak Tersedia"
    }</strong>`;

    layer.bindTooltip(tooltipContent, {
      className: "custom-leaflet-tooltip",
      sticky: true,
      direction: "auto",
    });

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        // Jangan ubah style jika ini adalah provinsi yang sedang dipilih, biarkan style "selected"
        if (provinceCode !== selectedProvinceCode) {
          targetLayer.setStyle({
            weight: 2,
            fillOpacity: 0.8,
            color: `rgb(${themeColors.brandPrimaryRGB})`,
          });
        }
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          targetLayer.bringToFront();
          if (provinceCode === selectedProvinceCode) {
            // Pastikan yang terpilih tetap di depan
            targetLayer.bringToFront();
          }
        }
      },
      mouseout: (e: LeafletMouseEvent) => {
        // Selalu kembalikan ke style yang ditentukan oleh getProvinceStyle (yang sudah menghandle selected)
        (e.target as L.Path).setStyle(getProvinceStyle(feature));
      },
      click: (e: LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        if (onProvinceClick && provinceName && provinceCode) {
          onProvinceClick(provinceName, provinceCode, currentData);
        }
      },
    });
  };

  // Key untuk GeoJSON layer. Object.values(themeColors).join(',') memastikan key berubah jika ada warna di themeColors berubah.
  const geoJsonKey =
    JSON.stringify(statistikData) +
    Object.values(themeColors).join(",") +
    selectedProvinceCode;

  if (!mapReady || !geojsonData) {
    return (
      <div
        style={{ height, width: "100%" }}
        className="bg-ui-border/10 animate-pulse rounded-lg flex items-center justify-center text-text-secondary"
      >
        Memuat Peta...
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height, width: "100%" }}
      className="rounded-lg shadow-md z-0 bg-surface-page" // bg-surface-page agar konsisten
      zoomControl={false} // Menghilangkan kontrol zoom default +/- untuk tampilan lebih bersih
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" // Tile layer tanpa label, fokus ke data
      />
      {geojsonData && (
        <GeoJSON
          key={geoJsonKey}
          data={geojsonData}
          style={getProvinceStyle}
          onEachFeature={onEachProvinceFeature}
        />
      )}
      {/* Jika Anda ingin kontrol zoom kustom, bisa tambahkan di sini atau di parent */}
      {/* <ZoomControl position="bottomright" /> */}
    </MapContainer>
  );
};

export default IndonesiaMap;
