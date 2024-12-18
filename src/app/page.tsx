import MyLineChart from "@/app/components/line-chart";
import { Suspense } from "react";
import { ChartLoader } from "@/app/components/chart-loader";
import { Box } from "@/app/components/box";
import { Title } from "@/app/components/title";
import { CountrySelector } from "@/app/components/country-selector";
import { getData } from "@/lib/eurostat";
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
        {config.economy.map(({ dataSetCode, params, euKey, label, unit }) => (
          <Suspense key={dataSetCode} fallback={<ChartLoader label={label} />}>
            <Chart
              dataSetCode={dataSetCode}
              params={params}
              euKey={euKey}
              searchParams={searchParams}
              label={label}
              unit={unit}
            />
          </Suspense>
        ))}
        <Title>Demographic Data</Title>

        {config.demography.map(
          ({ dataSetCode, params, euKey, label, unit }) => (
            <Suspense
              key={dataSetCode.concat(label)}
              fallback={<ChartLoader label={label} />}
            >
              <Chart
                dataSetCode={dataSetCode}
                params={params}
                euKey={euKey}
                searchParams={searchParams}
                label={label}
                unit={unit}
              />
            </Suspense>
          ),
        )}
      </div>
    </main>
  );
}

const config = {
  economy: [
    {
      dataSetCode: "prc_hicp_manr",
      params: {
        unit: "RCH_A",
        coicop: "CP00",
      },
      euKey:
        "european union (eu6-1958, eu9-1973, eu10-1981, eu12-1986, eu15-1995, eu25-2004, eu27-2007, eu28-2013, eu27-2020)",
      label: "Inflation",
      unit: "percent",
    },
    {
      dataSetCode: "namq_10_gdp",
      params: {
        unit: "CLV_PCH_PRE",
        s_adj: "SCA",
        na_item: "B1GQ",
      },
      euKey:
        "euro area (ea11-1999, ea12-2001, ea13-2007, ea15-2008, ea16-2009, ea17-2011, ea18-2014, ea19-2015, ea20-2023)",
      label: "GDP Growth",
      unit: "percent",
    },
    {
      dataSetCode: "une_rt_m",
      params: {
        unit: "PC_ACT",
        s_adj: "SA",
        age: "TOTAL",
        sex: "T",
      },
      euKey: "european union - 27 countries (from 2020)",
      label: "Unemployment",
      unit: "percent",
    },
    {
      dataSetCode: "prc_hpi_q",
      params: {
        purchase: "TOTAL",
      },
      euKey:
        "european union (eu6-1958, eu9-1973, eu10-1981, eu12-1986, eu15-1995, eu25-2004, eu27-2007, eu28-2013, eu27-2020)",
      label: "House Prices",
      unit: "index",
    },
  ],
  demography: [
    {
      dataSetCode: "demo_gind",
      params: {
        indic_de: "GROWRT",
        lang: "en",
      },
      euKey: "european economic area (eu28 - 2013-2020 and is, li, no)",
      label: "Population Growth",
      unit: "percent",
    },
    {
      dataSetCode: "demo_gind",
      params: {
        indic_de: "DEATH",
      },
      euKey: "european union - 27 countries (from 2020)",
      label: "Number of Deaths",
      unit: "count",
    },
    {
      dataSetCode: "demo_gind",
      params: {
        indic_de: "AVG",
      },
      euKey: "euro area – 20 countries (from 2023)",
      label: "Population",
      unit: "count",
    },
    {
      dataSetCode: "ilc_mddw03",
      params: {
        unit: "PC",
        hhtyp: "TOTAL",
        incgrp: "TOTAL",
      },
      euKey: "euro area – 20 countries (from 2023)",
      label: "Crime Rate",
      unit: "rate",
    },
  ],
} as const;

type ChartData = {
  dataSetCode: string;
  params: Record<string, string>;
  euKey: string;
  searchParams?: SearchParams;
  label: string;
  unit: "rate" | "count" | "index" | "millions" | "percent";
};

async function Chart({
  dataSetCode,
  params,
  euKey,
  searchParams,
  label,
  unit,
}: ChartData) {
  const data = await getData({ dataSetCode, params, euKey });
  const lineKey = ["eu"];
  if (searchParams) {
    lineKey.push(searchParams.country1 || "none");
    lineKey.push(searchParams.country2 || "none");
    lineKey.push(searchParams.country3 || "none");
    lineKey.push(searchParams.country4 || "none");
  }

  return (
    <Box label={label}>
      <MyLineChart data={data} xAxisKey="time" lineKey={lineKey} unit={unit} />
    </Box>
  );
}
