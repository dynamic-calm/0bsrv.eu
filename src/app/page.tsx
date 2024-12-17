import MyLineChart from "@/app/components/line-chart";
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
import { Suspense } from "react";
import { ChartLoader } from "@/app/components/chart-loader";
import { Box } from "@/app/components/box";
import { Title } from "@/app/components/title";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full p-2">
      <div className="grid h-full w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </main>
  );
}

async function Inflation() {
  const inflation = await getInflation();
  return (
    <Box label="Inflation">
      <MyLineChart
        data={inflation}
        xAxisKey="year"
        lineKey="inflation"
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
  const crimeRate = await getCrimeRate();
  return (
    <Box label="Crime Rate">
      <MyLineChart
        data={crimeRate}
        xAxisKey="year"
        lineKey="crimeRate"
        unit="rate"
      />
    </Box>
  );
}
