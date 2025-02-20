import { Suspense } from "react";
import { ChartLoader } from "@/components/chart-loader";
import { Box } from "@/components/box";
import { Title } from "@/components/title";
import { getData } from "@/lib/eurostat";
import { config, countryNameToISO, type DataSet } from "@/lib/config";
import { Header } from "@/components/header";
import EurostatMapChart from "@/components/map";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen bg-gray-100 px-2 pb-2">
      <Header />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Title className="mt-10">Economic Indicators</Title>
        {config.economy.map((data) => (
          <Suspense key={data.dataSetCode} fallback={<ChartLoader {...data} />}>
            <Chart {...data} />
          </Suspense>
        ))}
        <Title>Demographic Data</Title>
        {config.demography.map((data) => (
          <Suspense
            key={data.dataSetCode.concat(data.label)}
            fallback={<ChartLoader {...data} />}
          >
            <Chart {...data} />
          </Suspense>
        ))}
        <Title>Quality of Living</Title>
        {config.qualityOfLife.map((data) => (
          <Suspense
            key={data.dataSetCode.concat(data.label)}
            fallback={<ChartLoader {...data} />}
          >
            <Chart {...data} />
          </Suspense>
        ))}
        <Title>Environmental Data</Title>
        {config.environment.map((data) => (
          <Suspense
            key={data.dataSetCode.concat(data.label)}
            fallback={<ChartLoader {...data} />}
          >
            <Chart {...data} />
          </Suspense>
        ))}
        <Title>Criminal Data</Title>
        {config.criminal.map((data) => (
          <Suspense
            key={data.dataSetCode.concat(data.label)}
            fallback={<ChartLoader {...data} />}
          >
            <Chart {...data} />
          </Suspense>
        ))}
        <Title>Immigration Data</Title>
        {config.immigration.map((data) => (
          <Suspense
            key={data.dataSetCode.concat(data.label)}
            fallback={<ChartLoader {...data} />}
          >
            <Chart {...data} />
          </Suspense>
        ))}
        <Title>Health Data</Title>
        {config.health.map((data) => (
          <Suspense
            key={data.dataSetCode.concat(data.label)}
            fallback={<ChartLoader {...data} />}
          >
            <Chart {...data} />
          </Suspense>
        ))}
      </div>
    </main>
  );
}

async function Chart({
  dataSetCode,
  params,
  euKey,
  label,
  unit,
  debug,
  description,
  makePercent,
}: DataSet) {
  const data = await getData({
    dataSetCode,
    params,
    euKey,
    debug,
    makePercent,
  });

  const set = new Set(
    data.flatMap((d) =>
      Object.keys(countryNameToISO)
        .map((c) => d[c])
        .filter((c): c is number => typeof c === "number"),
    ),
  );
  const max = Math.max(...set);
  const min = Math.min(...set);

  return (
    <Box label={label} dataSetCode={dataSetCode} description={description}>
      <EurostatMapChart data={data} unit={unit} max={max} min={min} />
    </Box>
  );
}
