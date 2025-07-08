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
  statistikData,
  onProvinceClick,
  selectedProvinceCode,
}) => {
  const getProvinceStyle = (feature?: GeoJSON.Feature): PathOptions => {
    // PERBAIKAN 1: Tambahkan pengecekan di sini
    if (!feature?.properties) {
      return {
        fillColor: COLOR_SCALE.defaultFill,
        weight: 1,
        color: COLOR_SCALE.defaultBorder,
      };
    }

    const provinceCode = feature.properties.id;
    let fillColor = COLOR_SCALE.defaultFill;

    if (provinceCode && provinceCode === selectedProvinceCode) {
      return {
        fillColor: COLOR_SCALE.selected,
        weight: 2.5,
        color: COLOR_SCALE.selected,
        fillOpacity: 0.8,
      };
    }

    if (statistikData && provinceCode && statistikData[provinceCode]) {
      const value = statistikData[provinceCode].nilai;
      if (value > 75) fillColor = COLOR_SCALE.high;
      else if (value > 40) fillColor = COLOR_SCALE.medium;
      else if (value >= 0) fillColor = COLOR_SCALE.low;
    }

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: COLOR_SCALE.defaultBorder,
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    // PERBAIKAN 2: Tambahkan guard clause utama di sini
    // Jika tidak ada properties, jangan lakukan apa-apa pada layer ini.
    if (!feature.properties) {
      return;
    }

    // Dari sini ke bawah, kita bisa dengan aman mengakses feature.properties
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
      style={{ height: "100%", width: "100%", backgroundColor: "transparent" }}
      className="rounded-lg z-0"
      zoomControl={false}
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
