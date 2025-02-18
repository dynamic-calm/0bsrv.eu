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

function findMostRecentValue(
  data: Record<string, any>[],
  countryKey: string,
): number | null {
  for (let i = data.length - 1; i >= 0; i--) {
    const value = data[i][countryKey];
    if (value !== null && value !== undefined && !isNaN(value)) {
      return value;
    }
  }
  return null;
}

// Custom color scale function
function createColorScale(min: number, max: number) {
  const accentNumber = Math.floor(Math.random() * 5) + 1;
  const baseColor = "var(--color-gray-300)";
  const accentColor = `var(--accent-color-${accentNumber})`;

  return {
    scale: (value: number) => {
      if (value === undefined || value === null) return "var(--color-gray-400)";
      const normalized = (value - min) / (max - min);
      return `color-mix(in srgb, ${baseColor}, ${accentColor} ${normalized * 100}%)`;
    },
    baseColor,
    accentColor,
  };
}

export default function EuropeMapChart({
  data,
}: {
  data: Record<string, any>[];
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
    const {
      scale: colorScale,
      baseColor,
      accentColor,
    } = createColorScale(minValue, maxValue);

    const plot = Plot.plot({
      projection: {
        type: "conic-conformal",
        domain: europeGeoJSON,
        center: [25.19, 57],
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
          stroke: "var(--color-gray-600)",
          strokeWidth: 0.5,
          title: (d) => {
            const value = valueMap.get(d.id);
            if (value === null || value === undefined) {
              return `${d.properties.name}: No data available`;
            }
            return `${d.properties.name}: ${value.toFixed(2)}`;
          },
        }),
        // Legend text - max value
        Plot.text([[630, 25]], {
          text: [`${maxValue.toFixed(1)}`],
          fill: "var(--color-gray-1200)",
          fontSize: 10,
        }),
        // Legend text - min value
        Plot.text([[630, 115]], {
          text: [`${minValue.toFixed(1)}`],
          fill: "var(--color-gray-1200)",
          fontSize: 10,
        }),
        // Legend text - unit
        Plot.text([[630, 70]], {
          text: [data[data.length - 1].unit || "Value"],
          fill: "var(--color-gray-1200)",
          fontSize: 10,
        }),
        // Legend box with gradient
        // Plot.frame({
        //   stroke: "var(--color-gray-600)",
        //   fill: `linear-gradient(to bottom, ${accentColor}, ${baseColor})`,
        //   x1: 600,
        //   y1: 20,
        //   x2: 620,
        //   y2: 120,
        // }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data]);

  return (
    <div className="h-full w-full">
      <div
        ref={containerRef}
        className="flex h-full w-full items-center justify-center"
      />
    </div>
  );
}
