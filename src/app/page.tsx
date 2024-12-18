import MyLineChart from "@/app/components/line-chart";
import { Suspense } from "react";
import { ChartLoader } from "@/app/components/chart-loader";
import { Box } from "@/app/components/box";
import { Title } from "@/app/components/title";
import { CountrySelector } from "@/app/components/country-selector";
import {
  getCrimeRate,
  getDeaths,
  getGDPGrowth,
  getHousePriceIndex,
  getInflation,
  getPopulation,
  getPopulationGrowth,
  getUnemployment,
} from "@/lib/eurostat";
import { COUNTRIES } from "@/app/countries";
import { notFound } from "next/navigation";

type SearchParams = {
  country1?: string;
  country2?: string;
  country3?: string;
  country4?: string;
};
export default async function Home(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  if (searchParams) {
    for (const country of Object.values(searchParams)) {
      if (!COUNTRIES.includes(country)) return notFound();
    }
  }

  return (
    <main className="mx-auto min-h-screen px-2">
      <CountrySelector />
      <div className="3xl:grid-cols-3 grid grid-cols-1 gap-2 xl:grid-cols-2">
        <Title>Economic Indicators</Title>
        <Suspense fallback={<ChartLoader label="Inflation" />}>
          <Inflation searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<ChartLoader label="GDP Growth" />}>
          <GDPGrowth searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Unemployment" />}>
          <Unemployment searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<ChartLoader label="House Prices" />}>
          <HousePriceIndex searchParams={searchParams} />
        </Suspense>
        <Title>Demographic Data</Title>
        <Suspense fallback={<ChartLoader label="Population Growth" />}>
          <PopulationGrowth searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Number Of Deaths Per Year" />}>
          <Deaths searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Population" />}>
          <Population searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Crime Rate" />}>
          <CrimeRate searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function Inflation({ searchParams }: { searchParams?: SearchParams }) {
  const inflation = await getInflation();
  const lineKey = ["eu"];

  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }

  return (
    <Box label="Inflation">
      <MyLineChart
        data={inflation}
        xAxisKey="time"
        lineKey={lineKey}
        unit="percent"
      />
    </Box>
  );
}

async function GDPGrowth({ searchParams }: { searchParams?: SearchParams }) {
  const gdp = await getGDPGrowth();
  const lineKey = ["eu"];
  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }

  return (
    <Box label="GDP Growth">
      <MyLineChart
        data={gdp}
        xAxisKey="time"
        lineKey={lineKey}
        unit="percent"
      />
    </Box>
  );
}

async function Unemployment({ searchParams }: { searchParams?: SearchParams }) {
  const unemployment = await getUnemployment();
  const lineKey = ["eu"];
  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }
  return (
    <Box label="Unemployment">
      <MyLineChart
        data={unemployment}
        xAxisKey="time"
        lineKey={lineKey}
        unit="percent"
      />
    </Box>
  );
}

async function HousePriceIndex({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const housePriceIndex = await getHousePriceIndex();
  const lineKey = ["eu"];
  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }

  return (
    <Box label="House Prices">
      <MyLineChart
        data={housePriceIndex}
        xAxisKey="time"
        lineKey={lineKey}
        unit="index"
      />
    </Box>
  );
}

async function PopulationGrowth({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const populationGrowth = await getPopulationGrowth();
  const lineKey = ["eu"];
  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }

  return (
    <Box label="Population Growth">
      <MyLineChart
        data={populationGrowth}
        xAxisKey="time"
        lineKey={lineKey}
        unit="percent"
      />
    </Box>
  );
}

async function Deaths({ searchParams }: { searchParams?: SearchParams }) {
  const deaths = await getDeaths();

  const lineKey = ["eu"];
  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }

  return (
    <Box label="Number of Deaths Per Year">
      <MyLineChart
        data={deaths}
        xAxisKey="time"
        lineKey={lineKey}
        unit="count"
        tickFormatter="millions"
      />
    </Box>
  );
}

async function Population({ searchParams }: { searchParams?: SearchParams }) {
  const population = await getPopulation();
  const lineKey = ["eu"];
  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }

  return (
    <Box label="Population">
      <MyLineChart
        data={population}
        xAxisKey="time"
        lineKey={lineKey}
        unit="count"
        tickFormatter="millions"
      />
    </Box>
  );
}

async function CrimeRate({ searchParams }: { searchParams?: SearchParams }) {
  const crime = await getCrimeRate();

  const lineKey = ["eu"];
  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }

  return (
    <Box label="Crime Rate">
      <MyLineChart data={crime} xAxisKey="time" lineKey={lineKey} unit="rate" />
    </Box>
  );
}
