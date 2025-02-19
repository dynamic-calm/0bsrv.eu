"use client";

import { useEffect, useRef, useState } from "react";
import * as Plot from "@observablehq/plot";
import * as Slider from "@radix-ui/react-slider";
import europeGeoJSON from "@/geojson/europe.geojson";
import * as d3 from "d3";

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
  const set = new Set(
    data.flatMap((d) =>
      Object.keys(countryNameToISO)
        .map((c) => d[c])
        .filter((c): c is number => typeof c === "number"),
    ),
  );

  const max = Math.max(...set);
  const min = Math.min(...set);

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

    const { scale: colorScale, colors } = createColorScale(min, max);

    // Create map
    const mapPlot = Plot.plot({
      projection: ({ height }) => {
        return (
          d3
            .geoConicConformal()
            // .parallels([0, 60])
            .center([37, 47]) // Adjust latitude (second number) to move map up/down
            .scale(height * 1.3)
        ); // Adjust multiplier to zoom in/out
        // .translate([width / 2, height / 2.2]); // Adjust divisor in height to move up/down
      },
      color: {
        type: "quantize",
        domain: Array.from(
          { length: LEGEND_STEPS - 1 },
          (_, i) => min + ((max - min) * (i + 1)) / LEGEND_STEPS,
        ),
        range: colors,
        label: unit,
        legend: true,
        tickFormat: (d: number) => formatValue(d, unit, { floor: true }),
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
      height: 100,
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
              ? "var(--color-gray-1200)"
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
    });

    mapRef.current.append(mapPlot);
    timelineRef.current.append(timelinePlot);

    return () => {
      mapPlot.remove();
      timelinePlot.remove();
    };
  }, [data, selectedTimeIndex, min, max, unit]);

  return (
    <div className="flex h-full w-full flex-col">
      <div
        ref={mapRef}
        className="flex h-full w-full cursor-crosshair items-start justify-start pl-2"
      />
      <div
        ref={timelineRef}
        className="mt-8 flex w-full items-start justify-start"
      />
      <div className="flex w-full items-center justify-center px-2 pb-1">
        <Slider.Root
          className="relative flex h-5 w-full touch-none select-none items-center px-1"
          value={[selectedTimeIndex]}
          max={data.length - 1}
          step={1}
          onValueChange={(value) => setSelectedTimeIndex(value[0])}
        >
          <Slider.Track className="relative h-1 grow cursor-pointer rounded-full bg-gray-300">
            <Slider.Range className="absolute h-full rounded-full bg-gray-500" />
          </Slider.Track>
          <Slider.Thumb
            className="block h-3 w-3 cursor-grab rounded-full bg-gray-1200 active:cursor-grabbing"
            aria-label="Time"
          />
        </Slider.Root>
      </div>
    </div>
  );
}

function createColorScale(min: number, max: number) {
  const base = "var(--color-gray-300)";
  const accent = "var(--color-gray-1200)";

  const colors = Array.from({ length: LEGEND_STEPS }, (_, i) => {
    const normalized = i / (LEGEND_STEPS - 1);
    return `color-mix(in srgb, ${base}, ${accent} ${normalized * 100}%)`;
  });

  return {
    scale: (value: number) => {
      if (value === undefined || value === null) return "var(--color-gray-100)";
      const normalized = (value - min) / (max - min);
      return `color-mix(in srgb, ${base}, ${accent} ${Math.min(normalized * 100, 100)}%)`;
    },
    colors,
    baseColor: base,
    accentColor: accent,
  };
}

function formatValue(value: number, unit: string, opts?: { floor?: boolean }) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: unit === "percent" ? 1 : 0,
    notation: "compact",
  });

  if (opts?.floor) {
    value = Math.floor(value);
  }

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

function formatTimeLabel(time?: string) {
  if (!time) return "";

  if (time.includes("Q")) {
    const [year, quarter] = time.split("-Q");
    return `Q${quarter} ${year}`;
  }
  if (time.length === 7) {
    try {
      return new Date(time + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      console.warn("Invalid date format:", time);
      return time;
    }
  }
  return time;
}

function parseTimeString(timeStr: string): Date {
  if (timeStr.includes("Q")) {
    const [year, quarter] = timeStr.split("-Q");
    const month = (parseInt(quarter) - 1) * 3;
    return new Date(parseInt(year), month);
  }
  // For yearly data
  if (timeStr.length === 4) {
    return new Date(parseInt(timeStr), 0);
  }
  // For YYYY-MM format
  return new Date(timeStr + "-01");
}
