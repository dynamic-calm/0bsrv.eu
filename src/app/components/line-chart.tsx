"use client";

import { countries } from "@/lib/config";
import { notFound, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";

export default function MyLineChart({
  data,
  xAxisKey,
  unit,
  tickFormatter,
  hideEu,
}: {
  data: unknown[];
  xAxisKey: string;
  unit: string;
  tickFormatter?: "millions" | "thousands";
  hideEu?: boolean;
}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lineKey = hideEu ? [""] : ["eu"];
  if (searchParams) {
    lineKey.push(params.get("country1") || "none");
    lineKey.push(params.get("country2") || "none");
    lineKey.push(params.get("country3") || "none");
    lineKey.push(params.get("country4") || "none");
  }

  for (const param of params.values()) {
    if (!countries.includes(param) && param !== "none") notFound();
  }

  const formatter = useMemo(() => {
    if (tickFormatter === "millions") {
      return (value: number) => String(value / 1000_000).concat("M");
    }
    if (tickFormatter === "thousands") {
      return (value: number) => String(value / 1000).concat("K");
    }
  }, [tickFormatter]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="pl-2 pt-1 font-mono text-xxs font-semibold text-gray-1200">
        {unit}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 15,
            right: 40,
            left: -10,
            bottom: 15,
          }}
        >
          <CartesianGrid stroke="var(--color-gray-400)" vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            className="text-xxs"
            axisLine={false}
            tickCount={2}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis
            className="text-xxs"
            axisLine={false}
            tickFormatter={formatter}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-gray-200)",
              borderRadius: "0.125rem",
              border: "1px solid var(--color-gray-600)",
              fontFamily: "var(--font-geist-mono)",
            }}
            cursor={{
              stroke: "var(--color-gray-900)",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            formatter={(value: number) =>
              Intl.NumberFormat("en-US", {
                style: unit === "percent" ? "percent" : "decimal",
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }).format(unit === "percent" ? value / 100 : value)
            }
          />
          {typeof lineKey === "string" ? (
            <Line
              type="monotone"
              dataKey={lineKey}
              stroke="var(--accent-color-1)"
              dot={false}
              activeDot={false}
              animationEasing="ease-in-out"
              animationDuration={1200}
            />
          ) : (
            lineKey.map((key: string, index: number) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`var(--accent-color-${index + 1})`}
                dot={false}
                activeDot={false}
                animationEasing="ease-in-out"
                animationDuration={1200}
              />
            ))
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
