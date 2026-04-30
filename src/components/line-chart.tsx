"use client";

import { useDeferredValue, useEffect, useMemo, useRef } from "react";
import { countries } from "@/lib/config";
import { highlightColorIndex } from "@/lib/url-state";
import { useSelection } from "@/hooks/use-selection";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  type TooltipProps,
} from "recharts";

type Row = Record<string, string | number | undefined> & { time?: string };

const TOOLTIP_LIMIT = 10;

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
  const liveSelected = useSelection();
  const selected = useDeferredValue(liveSelected);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const contextCountries = useMemo(
    () => countries.filter((c) => !selectedSet.has(c)),
    [selectedSet],
  );

  const prevSelectedRef = useRef<string[]>([]);
  const justAdded = useMemo(() => {
    const prev = new Set(prevSelectedRef.current);
    return new Set(selected.filter((c) => !prev.has(c)));
  }, [selected]);
  useEffect(() => {
    prevSelectedRef.current = selected;
  }, [selected]);

  const formatValue = (value: number | string | undefined) => {
    if (value === undefined || value === null || value === "") return "—";
    const n = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(n)) return "—";
    let style: Intl.NumberFormatOptions["style"];
    if (unit === "percent") style = "percent";
    else if (unit === "eur") style = "currency";
    else style = "decimal";
    return Intl.NumberFormat("en-US", {
      style,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      notation: "compact",
      compactDisplay: "short",
      currencyDisplay: "narrowSymbol",
      currency: "EUR",
    }).format(unit === "percent" ? n / 100 : n);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="pl-2 pt-1 font-mono text-xxs font-semibold text-gray-1200">
        {unit}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data as Row[]}
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
            cursor={{
              stroke: "var(--color-gray-900)",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            wrapperStyle={{ pointerEvents: "auto" }}
            content={(props: TooltipProps<number, string>) => (
              <CustomTooltip
                {...props}
                hideEu={hideEu}
                selected={selected}
                formatValue={formatValue}
              />
            )}
          />

          {contextCountries.map((country) => (
            <Line
              key={`ctx-${country}`}
              type="monotone"
              dataKey={country}
              stroke="var(--context-line)"
              strokeWidth={1}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              connectNulls
            />
          ))}

          {selected.map((country, index) => {
            const colorIdx = highlightColorIndex(index);
            const stroke = `var(--accent-color-${colorIdx})`;
            const animate = justAdded.has(country);
            return (
              <Line
                key={`sel-${country}`}
                type="monotone"
                dataKey={country}
                stroke={stroke}
                strokeWidth={1.5}
                dot={false}
                activeDot={{
                  r: 3,
                  fill: stroke,
                  stroke: "var(--color-gray-100)",
                  strokeWidth: 1,
                }}
                isAnimationActive={animate}
                animationEasing="ease-in-out"
                animationDuration={500}
                connectNulls
              />
            );
          })}

          {!hideEu && (
            <Line
              key="eu"
              type="monotone"
              dataKey="eu"
              stroke="var(--accent-color-1)"
              strokeWidth={2.25}
              dot={false}
              activeDot={{
                r: 3.5,
                fill: "var(--accent-color-1)",
                stroke: "var(--color-gray-100)",
                strokeWidth: 1,
              }}
              isAnimationActive={false}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({
  active,
  label,
  payload,
  hideEu,
  selected,
  formatValue,
}: TooltipProps<number, string> & {
  hideEu?: boolean;
  selected: string[];
  formatValue: (value: number | string | undefined) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const byKey = new Map<string, number | undefined>();
  for (const p of payload) {
    if (typeof p.dataKey !== "string") continue;
    byKey.set(p.dataKey, p.value as number | undefined);
  }

  const allRows: { key: string; color: string; value: number | undefined }[] =
    [];
  selected.forEach((country, index) => {
    const colorIdx = highlightColorIndex(index);
    allRows.push({
      key: country,
      color: `var(--accent-color-${colorIdx})`,
      value: byKey.get(country),
    });
  });

  allRows.sort(
    (a, b) => Number(b.value ?? -Infinity) - Number(a.value ?? -Infinity),
  );

  const visible = allRows.slice(0, TOOLTIP_LIMIT);
  const hidden = allRows.length - visible.length;

  const rows: { key: string; color: string; value: number | undefined }[] = [];
  if (!hideEu) {
    rows.push({
      key: "eu",
      color: "var(--accent-color-1)",
      value: byKey.get("eu"),
    });
  }
  rows.push(...visible);

  return (
    <div
      style={{
        backgroundColor: "var(--color-gray-200)",
        borderRadius: "0.125rem",
        border: "1px solid var(--color-gray-600)",
        fontFamily: "var(--font-geist-mono)",
      }}
      className="px-2 py-1.5 text-xxs"
    >
      <div className="mb-1 text-gray-1000">{label}</div>
      <div className="space-y-0.5">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-2">
            <span
              className="size-2 min-w-2"
              style={{ backgroundColor: row.color }}
              aria-hidden
            />
            <span className="flex-1 truncate">{row.key}</span>
            <span className="tabular-nums text-gray-1200">
              {formatValue(row.value)}
            </span>
          </div>
        ))}
        {hidden > 0 && (
          <div className="pt-0.5 text-gray-1000">+{hidden} more</div>
        )}
      </div>
    </div>
  );
}
