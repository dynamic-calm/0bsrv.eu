"use client";

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
  XAxisKey,
  LineKey,
}: {
  data: unknown[];
  XAxisKey: string;
  LineKey: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: -10,
          bottom: 30,
        }}
      >
        <CartesianGrid stroke="var(--color-gray-400)" vertical={false} />
        <XAxis
          dataKey={XAxisKey}
          className="text-xxs"
          axisLine={false}
          tickCount={2}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis className="text-xxs" axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-gray-200)",
            borderRadius: "0.125rem",
            border: "1px solid var(--color-gray-600)",
          }}
          cursor={{
            stroke: "var(--color-gray-900)",
            strokeWidth: 1,
            strokeDasharray: "3 3",
          }}
        />
        <Line
          type="linear"
          dataKey={LineKey}
          stroke="var(--accent-color-blue)"
          dot={false}
          isAnimationActive={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
