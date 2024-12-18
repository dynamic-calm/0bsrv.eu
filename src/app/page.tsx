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
  console.log("onpageeeee", searchParams);

  return (
    <main className="mx-auto min-h-screen px-2">
      <CountrySelector />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
        <Title>Economic Indicators</Title>
        <Suspense fallback={<ChartLoader label="Inflation" />}>
          <Inflation searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<ChartLoader label="GDP Growth" />}>
          <GDPGrowth />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Unemployment" />}>
          <Unemployment />
        </Suspense>
        <Suspense fallback={<ChartLoader label="House Prices" />}>
          <HousePriceIndex />
        </Suspense>
        <Title>Demographic Data</Title>
        <Suspense fallback={<ChartLoader label="Population Growth" />}>
          <PopulationGrowth />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Female and Male Birth Rate" />}>
          <Deaths />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Population" />}>
          <Population />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Crime Rate" />}>
          <CrimeRate />
        </Suspense>
        <Title>Economic Indicators</Title>
        <Suspense fallback={<ChartLoader label="Inflation" />}>
          <Inflation />
        </Suspense>
        <Suspense fallback={<ChartLoader label="GDP Growth" />}>
          <GDPGrowth />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Unemployment" />}>
          <Unemployment />
        </Suspense>
        <Suspense fallback={<ChartLoader label="House Prices" />}>
          <HousePriceIndex />
        </Suspense>
      </div>
    </main>
  );
}

async function Inflation({ searchParams }: { searchParams?: SearchParams }) {
  const inflation = await getInflation();
  const lineKey = ["spain"];

  console.log("searchParams on inflation", searchParams);
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

async function GDPGrowth() {
  const gdp = await getGDPGrowth();
  return (
    <Box label="GDP Growth">
      <MyLineChart data={gdp} xAxisKey="year" lineKey="gdp" unit="percent" />
    </Box>
  );
}

async function Unemployment() {
  const unemployment = await getUnemployment();
  return (
    <Box label="Unemployment">
      <MyLineChart
        data={unemployment}
        xAxisKey="year"
        lineKey="unemployment"
        unit="percent"
      />
    </Box>
  );
}

async function PopulationGrowth() {
  const populationGrowth = await getPopulationGrowth();
  return (
    <Box label="Population Growth">
      <MyLineChart
        data={populationGrowth}
        xAxisKey="year"
        lineKey="growth"
        unit="percent"
      />
    </Box>
  );
}

async function Deaths() {
  const deaths = await getDeaths();
  return (
    <Box label="Number of Deaths Per Year">
      <MyLineChart
        data={deaths}
        xAxisKey="year"
        lineKey="deaths"
        unit="count"
        tickFormatter="millions"
      />
    </Box>
  );
}

async function Population() {
  const population = await getPopulation();
  return (
    <Box label="Population">
      <MyLineChart
        data={population}
        xAxisKey="year"
        lineKey="population"
        unit="count"
        tickFormatter="millions"
      />
    </Box>
  );
}

async function HousePriceIndex() {
  const housePriceIndex = await getHousePriceIndex();
  return (
    <Box label="House Prices">
      <MyLineChart
        data={housePriceIndex}
        xAxisKey="year"
        lineKey="price"
        unit="index"
      />
    </Box>
  );
}

async function CrimeRate() {
  const crime = await getCrimeRate();
  return (
    <Box label="Crime Rate">
      <MyLineChart data={crime} xAxisKey="year" lineKey="crime" unit="rate" />
    </Box>
  );
}
