import MyLineChart from "@/app/components/line-chart";
import { Suspense } from "react";
import { ChartLoader } from "@/app/components/chart-loader";
import { Box } from "@/app/components/box";
import { Title } from "@/app/components/title";
import { CountrySelector } from "@/app/components/country-selector";
import { getData } from "@/lib/eurostat";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen px-2">
      <Suspense>
        <CountrySelector />
      </Suspense>
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
        <Title>Economic Indicators</Title>
        {config.economy.map((data) => (
          <Suspense
            key={data.dataSetCode}
            fallback={
              <ChartLoader label={data.label} dataSetCode={data.dataSetCode} />
            }
          >
            <Chart {...data} />
          </Suspense>
        ))}
        <Title>Demographic Data</Title>
        {config.demography.map((data) => (
          <Suspense
            key={data.dataSetCode.concat(data.label)}
            fallback={
              <ChartLoader label={data.label} dataSetCode={data.dataSetCode} />
            }
          >
            <Chart {...data} />
          </Suspense>
        ))}
      </div>
    </main>
  );
}

type ChartData = {
  dataSetCode: string;
  params: Record<string, string>;
  euKey: string;
  label: string;
  unit: "rate" | "count" | "index" | "percent";
  hideEu?: boolean;
  tickFormatter?: "millions" | "thousands";
};

async function Chart({
  dataSetCode,
  params,
  euKey,
  label,
  unit,
  hideEu,
  tickFormatter,
}: ChartData) {
  const data = await getData({ dataSetCode, params, euKey });
  return (
    <Box label={label} dataSetCode={dataSetCode}>
      <MyLineChart
        data={data}
        xAxisKey="time"
        unit={unit}
        tickFormatter={tickFormatter}
        hideEu={hideEu}
      />
    </Box>
  );
}
