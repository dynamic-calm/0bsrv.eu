"use client";

import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import europeGeoJSON from "@/geojson/europe.geojson";

const countryNameToISO: Record<string, string> = {
  belgium: "BE",
  bulgaria: "BG",
  czechia: "CZ",
  denmark: "DK",
  germany: "DE",
  estonia: "EE",
  ireland: "IE",
  greece: "EL",
  spain: "ES",
  france: "FR",
  croatia: "HR",
  italy: "IT",
  cyprus: "CY",
  latvia: "LV",
  lithuania: "LT",
  luxembourg: "LU",
  hungary: "HU",
  malta: "MT",
  netherlands: "NL",
  austria: "AT",
  poland: "PL",
  portugal: "PT",
  romania: "RO",
  slovenia: "SI",
  slovakia: "SK",
  finland: "FI",
  sweden: "SE",
  iceland: "IS",
  norway: "NO",
  switzerland: "CH",
  "united kingdom": "GB",
  türkiye: "TR",
};

const LEGEND_STEPS = 5;

function findMostRecentValue(
  data: Record<string, unknown>[],
  countryKey: string,
): number | null {
  for (let i = data.length - 1; i >= 0; i--) {
    const value = data[i][countryKey];
    if (value !== null && value !== undefined && !isNaN(value as number)) {
      return value as number;
    }
  }
  return null;
}

function createColorScale(min: number, max: number) {
  const accentNumber = Math.floor(Math.random() * 5) + 1;
  const baseColor = "var(--color-gray-100)";
  const accentColor = `var(--accent-color-${accentNumber})`;

  const colors = Array.from({ length: LEGEND_STEPS }, (_, i) => {
    const normalized = i / (LEGEND_STEPS - 1);
    return `color-mix(in srgb, ${baseColor}, ${accentColor} ${Math.min(normalized * 100 + 20, 100)}%)`;
  });

  return {
    scale: (value: number) => {
      if (value === undefined || value === null) return "var(--color-gray-300)";
      const normalized = (value - min) / (max - min);
      return `color-mix(in srgb, ${baseColor}, ${accentColor} ${Math.min(normalized * 100 + 20, 100)}%)`;
    },
    colors,
    baseColor,
    accentColor,
  };
}

export default function EuropeMapChart({
  data,
  unit,
}: {
  data: Record<string, unknown>[];
  unit: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const valueMap = new Map();
    const validValues: number[] = [];

    Object.keys(countryNameToISO).forEach((countryName) => {
      const value = findMostRecentValue(data, countryName);
      if (value !== null) {
        const isoCode = countryNameToISO[countryName];
        valueMap.set(isoCode, value);
        validValues.push(value);
      }
    });

    if (containerRef.current.firstChild) {
      containerRef.current.firstChild.remove();
    }

    const minValue = Math.min(...validValues);
    const maxValue = Math.max(...validValues);
    const { scale: colorScale, colors } = createColorScale(minValue, maxValue);

    const plot = Plot.plot({
      projection: {
        type: "conic-conformal",
        domain: europeGeoJSON,
        center: [25.19, 57],
      },
      color: {
        type: "quantize",
        domain: Array.from(
          { length: LEGEND_STEPS - 1 },
          (_, i) => minValue + ((maxValue - minValue) * (i + 1)) / LEGEND_STEPS,
        ),
        range: colors,
        label: unit,
        legend: true,
        tickFormat: (d: number) =>
          new Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          }).format(d),
      },
      style: {
        backgroundColor: "transparent",
        overflow: "visible",
      },
      marks: [
        Plot.geo(europeGeoJSON.features, {
          fill: (d) => {
            const value = valueMap.get(d.id);
            return colorScale(value);
          },
          title: (d) => {
            const value = valueMap.get(d.id);
            if (value === null || value === undefined) {
              return `${d.properties.name}: No data available`;
            }
            return `${d.properties.name}: ${value.toFixed(2)}`;
          },
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data]);

  return (
    <div className="h-full w-full">
      <div
        ref={containerRef}
        className="flex h-full w-full items-start justify-start pl-2"
      />
    </div>
  );
}
