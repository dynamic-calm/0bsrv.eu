"use client";

import { countries } from "@/lib/config";
import { notFound, useSearchParams } from "next/navigation";
import { random } from "colord";

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
  hideEu,
}: {
  data: unknown[];
  xAxisKey: string;
  unit: string;
  hideEu?: boolean;
}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lineKey = hideEu ? [""] : ["eu"];
  lineKey.push(params.get("country1") || "none");
  lineKey.push(params.get("country2") || "none");
  lineKey.push(params.get("country3") || "none");
  lineKey.push(params.get("country4") || "none");
  const all = Boolean(params.get("all"));

  if (!all) {
    for (const param of params.values()) {
      if (!countries.includes(param) && param !== "none") {
        notFound();
      }
    }
  }

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
            tickFormatter={(value: number) =>
              Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-gray-200)",
              borderRadius: "0.125rem",
              border: "1px solid var(--color-gray-600)",
              fontFamily: "var(--font-geist-mono)",
              overflow: "auto",
              maxHeight: all === true ? "250px" : "none",
            }}
            itemSorter={(item) => -Number(item.value)}
            cursor={{
              stroke: "var(--color-gray-900)",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            wrapperStyle={{ pointerEvents: "auto" }}
            formatter={(value: number) => {
              let style: Intl.NumberFormatOptions["style"];
              if (unit === "percent") {
                style = "percent";
              } else if (unit === "eur") {
                style = "currency";
              } else {
                style = "decimal";
              }

              return Intl.NumberFormat("en-US", {
                style,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
                notation: "compact",
                compactDisplay: "short",
                currencyDisplay: "narrowSymbol",
                currency: "EUR",
              }).format(unit === "percent" ? value / 100 : value);
            }}
          />

          {[...(all === true ? countries : lineKey)].map(
            (key: string, index: number) => {
              const stroke = `var(--accent-color-${index + 1})`;
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={stroke}
                  dot={false}
                  activeDot={false}
                  animationEasing="ease-in-out"
                  animationDuration={1200}
                />
              );
            },
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
