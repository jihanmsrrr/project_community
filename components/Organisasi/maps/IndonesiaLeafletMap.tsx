// components/Organisasi/maps/IndonesiaLeafletMap.tsx
"use client";

import React from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import L, { Layer, PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";

// Tipe data
export interface ProvinceProperties {
  id: string;
  name: string;
}
export interface ProvinceStatistic {
  nilai: number;
  detail?: string;
}
export interface StatistikData {
  [provinceCode: string]: ProvinceStatistic;
}
interface IndonesiaMapProps {
  geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry, ProvinceProperties>;
  statistikData?: StatistikData;
  onProvinceClick?: (provinceName: string, provinceCode: string) => void;
  selectedProvinceCode?: string | null;
}

const COLOR_SCALE = {
  selected: "#0284c7",
  hover: "#0369a1",
  high: "#38bdf8",
  medium: "#7dd3fc",
  low: "#e0f2fe",
  defaultFill: "#e5e7eb", // gray-200
  defaultBorder: "#9ca3af",
};

const IndonesiaMap: React.FC<IndonesiaMapProps> = ({
  geojsonData,
  onProvinceClick,
  selectedProvinceCode,
}) => {
  console.log("IndonesiaMap - geojsonData:", geojsonData);

  const pulauWarna = {
    Sumatera: "lightblue",
    Jawa: "lightgreen",
    Kalimantan: "lightyellow",
    Sulawesi: "lightpink",
    "Bali & Nusa Tenggara": "lightcoral",
    Maluku: "lightsalmon",
    Papua: "lightseagreen",
  };

  const provinsiPulau = {
    "1100": "Sumatera", // Aceh
    "1200": "Sumatera", // Sumatera Utara
    "1300": "Sumatera", // Sumatera Barat
    "1400": "Sumatera", // Riau
    "1500": "Sumatera", // Jambi
    "1600": "Sumatera", // Sumatera Selatan
    "1700": "Sumatera", // Bengkulu
    "1800": "Sumatera", // Lampung
    "1900": "Sumatera", // Kep. Bangka Belitung
    "2100": "Sumatera", // Kepulauan Riau
    "3100": "Jawa", // DKI Jakarta
    "3200": "Jawa", // Jawa Barat
    "3300": "Jawa", // Jawa Tengah
    "3400": "Jawa", // DI Yogyakarta
    "3500": "Jawa", // Jawa Timur
    "3600": "Jawa", // Banten
    "5100": "Bali & Nusa Tenggara", // Bali
    "5200": "Bali & Nusa Tenggara", // Nusa Tenggara Barat
    "5300": "Bali & Nusa Tenggara", // Nusa Tenggara Timur
    "6100": "Kalimantan", // Kalimantan Barat
    "6200": "Kalimantan", // Kalimantan Tengah
    "6300": "Kalimantan", // Kalimantan Selatan
    "6400": "Kalimantan", // Kalimantan Timur
    "6500": "Kalimantan", // Kalimantan Utara
    "7100": "Sulawesi", // Sulawesi Utara
    "7200": "Sulawesi", // Sulawesi Tengah
    "7300": "Sulawesi", // Sulawesi Selatan
    "7400": "Sulawesi", // Sulawesi Tenggara
    "7500": "Sulawesi", // Gorontalo
    "7600": "Sulawesi", // Sulawesi Barat
    "8100": "Maluku", // Maluku
    "8200": "Maluku", // Maluku Utara
    "9100": "Papua", // Papua Barat
    "9400": "Papua", // Papua (induk)
    "9405": "Papua", // Papua Selatan (kode perkiraan)
    "9403": "Papua", // Papua Tengah (kode perkiraan)
    "9404": "Papua", // Papua Pegunungan (kode perkiraan)
    "9102": "Papua", // Papua Barat Daya (kode perkiraan)
  };

  const getProvinceStyle = (feature?: GeoJSON.Feature): PathOptions => {
    if (!feature?.properties) {
      return {
        fillColor: COLOR_SCALE.defaultFill,
        weight: 1,
        color: COLOR_SCALE.defaultBorder,
      };
    }

    const provinceCode = feature.properties.id;
    const pulau =
      provinsiPulau[provinceCode as keyof typeof provinsiPulau] || "Lainnya";
    const warna =
      pulauWarna[pulau as keyof typeof pulauWarna] || COLOR_SCALE.defaultFill;

    return {
      fillColor: warna,
      weight: 1,
      opacity: 1,
      color: COLOR_SCALE.defaultBorder,
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    if (!feature.properties) {
      return;
    }

    const provinceName = feature.properties.name;
    const provinceCode = feature.properties.id;

    layer.bindTooltip(provinceName, {
      className: "custom-leaflet-tooltip",
      sticky: true,
    });

    layer.on({
      mouseover: (e) => {
        const target = e.target as L.Path;
        if (provinceCode !== selectedProvinceCode) {
          target.setStyle({
            weight: 2.5,
            color: COLOR_SCALE.hover,
            fillOpacity: 0.9,
          });
        }
        target.bringToFront();
      },
      mouseout: (e) => {
        (e.target as L.Path).setStyle(getProvinceStyle(feature));
      },
      click: () => {
        if (onProvinceClick && provinceName && provinceCode) {
          onProvinceClick(provinceName, provinceCode);
        }
      },
    });
  };

  const geoJsonKey = `indonesia-map-${selectedProvinceCode}`;

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "450px", width: "100%" }}
      className="rounded-lg z-0"
      zoomControl={false}
      maxBounds={[
        [-11, 95],
        [6, 141],
      ]} // Restrict zooming/panning outside Indonesia
      bounds={[
        [-11, 95],
        [6, 141],
      ]} // Set initial view to fit Indonesia
      boundsOptions={{ padding: [20, 20] }} // Optional padding
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <GeoJSON
        key={geoJsonKey}
        data={geojsonData}
        style={getProvinceStyle}
        onEachFeature={onEachFeature}
      />
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
};

export default IndonesiaMap;
