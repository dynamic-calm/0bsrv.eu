import MyLineChart from "@/app/components/line-chart";
import {
  getDeaths,
  getGDPGrowth,
  getInflation,
  getPopulationGrowth,
  getUnemployment,
} from "@/lib/eurostat";
import { Suspense } from "react";
import { ChartLoader } from "@/app/components/chart-loader";
import { Box } from "@/app/components/box";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full p-2">
      <div className="grid h-full w-full grid-cols-3 gap-2">
        <Suspense fallback={<ChartLoader label="Inflation" />}>
          <Inflation />
        </Suspense>
        <Suspense fallback={<ChartLoader label="GDP Growth" />}>
          <GDPGrowth />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Unemployment" />}>
          <Unemployment />
        </Suspense>
        <div className="col-span-full mt-4 text-lg font-semibold tracking-tight">
          Demographic Data
        </div>
        <Suspense fallback={<ChartLoader label="Population Growth" />}>
          <PopulationGrowth />
        </Suspense>
        <Suspense fallback={<ChartLoader label="Female and Male Birth Rate" />}>
          <FemaleAndMaleBirthRate />
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

async function FemaleAndMaleBirthRate() {
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
