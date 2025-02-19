import { Suspense } from "react";
import { ChartLoader } from "@/components/chart-loader";
import { Box } from "@/components/box";
import { Title } from "@/components/title";
import { getData } from "@/lib/eurostat";
import { config, type DataSet } from "@/lib/config";
import EuropeMapChart from "@/components/map";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen bg-gray-100 px-2 pb-2">
      {/* <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense> */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
        <Title>Economic Indicators</Title>
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
}: DataSet) {
  const data = await getData({ dataSetCode, params, euKey, debug });
  return (
    <Box label={label} dataSetCode={dataSetCode} description={description}>
      <EuropeMapChart data={data} unit={unit} />
    </Box>
  );
}
