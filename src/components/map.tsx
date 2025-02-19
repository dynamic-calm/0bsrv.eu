"use client";

import { useEffect, useRef, useState } from "react";
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

interface EurostatData {
  time: string;
  [country: string]: number | string;
}

interface Props {
  data: EurostatData[];
  unit: string;
}

export default function EurostatMapChart({ data, unit }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(data?.length - 1);

  useEffect(() => {
    if (!data || !mapRef.current || !timelineRef.current) return;

    // Clear existing plots
    if (mapRef.current.firstChild) mapRef.current.firstChild.remove();
    if (timelineRef.current.firstChild) timelineRef.current.firstChild.remove();

    const timePoint = data[selectedTimeIndex];
    const validValues: number[] = [];
    const valueMap = new Map();

    // Process values for the selected time point
    Object.entries(countryNameToISO).forEach(([countryName, isoCode]) => {
      const value = timePoint[countryName];
      if (typeof value === "number" && !isNaN(value)) {
        valueMap.set(isoCode, value);
        validValues.push(value);
      }
    });

    const minValue = Math.min(...validValues);
    const maxValue = Math.max(...validValues);
    const { scale: colorScale, colors } = createColorScale(minValue, maxValue);

    // Create map
    const mapPlot = Plot.plot({
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
        tickFormat: (d: number) => formatValue(d, unit),
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
            return `${d.properties.name}: ${formatValue(value, unit)}`;
          },
        }),
      ],
    });

    // Prepare timeline data
    const timelineData = data.map((d, index) => {
      const countryValues = Object.entries(countryNameToISO)
        .map(([country]) => d[country])
        .filter((val): val is number => typeof val === "number" && !isNaN(val));

      return {
        index,
        time: parseTimeString(d.time), // Convert to Date object
        timeLabel: d.time, // Keep original string for labels
        average:
          countryValues.reduce((sum, val) => sum + val, 0) /
          countryValues.length,
      };
    });
    // Create timeline
    const timelinePlot = Plot.plot({
      height: 150,
      marginBottom: 40,
      style: {
        backgroundColor: "transparent",
      },
      marks: [
        Plot.line(timelineData, {
          x: "time",
          y: "average",
          stroke: "var(--color-gray-1000)",
        }),
        Plot.dot(timelineData, {
          x: "time",
          y: "average",
          fill: (d) =>
            d.index === selectedTimeIndex
              ? "var(--color-gray-1100)"
              : "var(--color-gray-600)",
          r: (d) => (d.index === selectedTimeIndex ? 6 : 4),
        }),
        Plot.text(timelineData, {
          x: "time",
          y: "average",
          text: (d) =>
            d.index === selectedTimeIndex ? formatTimeLabel(d.timeLabel) : "",
          dy: -10,
        }),
      ],
      grid: true,
      x: {
        type: "utc", // Use UTC time scale
        tickRotate: -45,
        tickFormat: (d: Date) =>
          formatTimeLabel(
            timelineData.find((td) => td.time.getTime() === d.getTime())
              ?.timeLabel ?? "",
          ),
      },
      y: {
        type: "linear",
        label: `Average ${unit}`,
        tickFormat: (d: number) => formatValue(d, unit),
      },
    });

    const controller = new AbortController();
    timelinePlot.addEventListener(
      "click",
      (event: MouseEvent | Event) => {
        const mouseEvent = event as MouseEvent;
        const bounds = timelinePlot.getBoundingClientRect();
        const x = mouseEvent.clientX - bounds.left;
        const width = bounds.width;
        const clickedIndex = Math.round((x / width) * (data.length - 1));
        setSelectedTimeIndex(
          Math.max(0, Math.min(clickedIndex, data.length - 1)),
        );
      },
      { signal: controller.signal },
    );

    mapRef.current.append(mapPlot);
    timelineRef.current.append(timelinePlot);

    return () => {
      mapPlot.remove();
      timelinePlot.remove();
      controller.abort();
    };
  }, [data, selectedTimeIndex]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div
        ref={mapRef}
        className="flex h-full w-full items-start justify-start pl-2"
      />
      <div
        ref={timelineRef}
        className="flex w-full items-start justify-start pl-2"
      />
    </div>
  );
}

function createColorScale(min: number, max: number) {
  const base = "var(--color-gray-400)";
  const accent = "var(--color-gray-1200)";

  const colors = Array.from({ length: LEGEND_STEPS }, (_, i) => {
    const normalized = i / (LEGEND_STEPS - 1);
    return `color-mix(in srgb, ${base}, ${accent} ${normalized * 100}%)`;
  });

  return {
    scale: (value: number) => {
      if (value === undefined || value === null) return "var(--color-gray-200)";
      const normalized = (value - min) / (max - min);
      return `color-mix(in srgb, ${base}, ${accent} ${Math.min(normalized * 100, 100)}%)`;
    },
    colors,
    baseColor: base,
    accentColor: accent,
  };
}
function parseTimeString(timeStr: string): Date {
  if (timeStr.includes("Q")) {
    const [year, quarter] = timeStr.split("-Q");
    const month = (parseInt(quarter) - 1) * 3;
    return new Date(parseInt(year), month);
  }
  if (timeStr.length === 7) {
    // YYYY-MM
    return new Date(timeStr + "-01");
  }
  return new Date(timeStr); // YYYY
}

function formatValue(value: number, unit: string) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: unit === "percent" ? 1 : 0,
    notation: "compact",
  });

  switch (unit) {
    case "percent":
      return `${formatter.format(value)}%`;
    case "index":
      return formatter.format(value);
    case "count":
      return formatter.format(value);
    case "tonnes p/c":
      return `${formatter.format(value)} t/capita`;
    case "eur":
      return `€${formatter.format(value)}`;
    case "tonnes":
      return `${formatter.format(value)} t`;
    default:
      return formatter.format(value);
  }
}

function formatTimeLabel(time: string) {
  // Handle different time formats (YYYY-Q#, YYYY-MM, YYYY)
  if (time.includes("Q")) {
    const [year, quarter] = time.split("-Q");
    return `Q${quarter} ${year}`;
  }
  if (time.length === 7) {
    // YYYY-MM
    return new Date(time + "-01").toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  return time; // YYYY
}
