import MyLineChart from "@/app/components/line-chart";
import { Suspense } from "react";
import { ChartLoader } from "@/app/components/chart-loader";
import { Box } from "@/app/components/box";
import { Title } from "@/app/components/title";
import { CountrySelector } from "@/app/components/country-selector";
import { CountrySelectorFallback } from "@/app/components/country-selector-fallback";
import { getData } from "@/lib/eurostat";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen bg-gray-100 px-2">
      <Suspense fallback={<CountrySelectorFallback />}>
        <CountrySelector />
      </Suspense>
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2 3xl:grid-cols-3">
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
        <Title>Quality of Living</Title>
        {config.qualityOfLife.map((data) => (
          <Suspense
            key={data.dataSetCode.concat(data.label)}
            fallback={
              <ChartLoader label={data.label} dataSetCode={data.dataSetCode} />
            }
          >
            <Chart {...data} />
          </Suspense>
        ))}
        <Title>Environmental Data</Title>
        {config.environment.map((data) => (
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
  unit: "rate" | "count" | "index" | "percent" | "tonnes p/c" | "eur";
  hideEu?: boolean;
  tickFormatter?: "millions" | "thousands";
  debug?: boolean;
};

async function Chart({
  dataSetCode,
  params,
  euKey,
  label,
  unit,
  hideEu,
  debug,
}: ChartData) {
  const data = await getData({ dataSetCode, params, euKey, debug });
  return (
    <Box label={label} dataSetCode={dataSetCode}>
      <MyLineChart data={data} xAxisKey="time" unit={unit} hideEu={hideEu} />
    </Box>
  );
}
