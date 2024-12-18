import JSONstat from "jsonstat-toolkit";

const HOST =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

type Inflation = {
  time: string;
  value: number;
  [key: string]: number | string;
};

export async function getInflation() {
  const dataSetCode = "prc_hicp_manr";
  const params = new URLSearchParams({
    unit: "RCH_A",
    coicop: "CP00",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: { geo: string; value: number }) => ({
      ...result,
      [result.geo.toLowerCase()]: result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const inflation = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Inflation, item: Inflation) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    inflation.push(dataPerTime);
  }

  return inflation as Inflation[];
}

type GDPGrowth = {
  gdp: number;
  year: string;
};

export async function getGDPGrowth() {
  const dataSetCode = "namq_10_gdp";
  const params = new URLSearchParams({
    geo: "EA",
    unit: "CLV_PCH_PRE",
    s_adj: "SCA",
    na_item: "B1GQ",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const data = jst
    .Dataset(0)
    .toTable()
    .flatMap((result: unknown[]) => {
      const gdp = result.at(-1);
      const year = result.at(-2);
      return !gdp ? [] : [{ gdp, year }];
    });

  return data as GDPGrowth[];
}

type Unemployment = {
  unemployment: number;
  year: string;
};

export async function getUnemployment() {
  const dataSetCode = "une_rt_m";

  const params = new URLSearchParams({
    geo: "EU27_2020",
    unit: "PC_ACT",
    s_adj: "SA",
    age: "TOTAL",
    sex: "T",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const data = jst
    .Dataset(0)
    .toTable()
    .flatMap((result: unknown[]) => {
      const unemployment = result.at(-1);
      const year = result.at(-2);
      return !unemployment ? [] : [{ unemployment, year }];
    });

  return data as Unemployment[];
}

type PopulationGrowth = {
  growth: number;
  year: string;
};

export async function getPopulationGrowth() {
  const dataSetCode = "demo_gind";
  const params = new URLSearchParams({
    geo: "EU28",
    indic_de: "GROWRT",
    lang: "en",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const data = jst
    .Dataset(0)
    .toTable()
    .flatMap((result: unknown[]) => {
      const growth = result.at(-1);
      const year = result.at(-2);
      return !growth ? [] : [{ growth, year }];
    });

  return data as PopulationGrowth[];
}

type Deaths = {
  deaths: number;
  year: string;
};

export async function getDeaths() {
  const dataSetCode = "demo_gind";
  const params = new URLSearchParams({
    geo: "EA19",
    indic_de: "DEATH",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const data = jst
    .Dataset(0)
    .toTable()
    .flatMap((result: unknown[]) => {
      const deaths = result.at(-1);
      const year = result.at(-2);
      return !deaths ? [] : [{ deaths: Number(deaths), year }];
    });

  return data as Deaths[];
}

type Population = {
  population: number;
  year: string;
};

export async function getPopulation() {
  const dataSetCode = "demo_gind";
  const params = new URLSearchParams({
    geo: "EU27_2020",
    indic_de: "AVG",
    lang: "en",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const data = jst
    .Dataset(0)
    .toTable()
    .flatMap((result: unknown[]) => {
      const population = result.at(-1);
      const year = result.at(-2);
      return !population ? [] : [{ population, year }];
    });

  return data as Population[];
}

type HousePriceIndex = {
  price: number;
  year: string;
};

export async function getHousePriceIndex() {
  const dataSetCode = "prc_hpi_q";
  const params = new URLSearchParams({
    geo: "EU",
    purchase: "TOTAL",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const data = jst
    .Dataset(0)
    .toTable()
    .flatMap((result: unknown[]) => {
      const price = result.at(-1);
      const year = result.at(-2);
      return !price || Number(price) < 50 ? [] : [{ price, year }];
    })
    .sort((a: HousePriceIndex, b: HousePriceIndex) =>
      a.year.localeCompare(b.year),
    );

  return data;
}

type CrimeRate = {
  crime: number;
  year: string;
};

export async function getCrimeRate() {
  const dataSetCode = "ilc_mddw03";
  const params = new URLSearchParams({
    geo: "EU",
    unit: "PC",
    hhtyp: "TOTAL",
    incgrp: "TOTAL",
    lang: "en",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const data = jst
    .Dataset(0)
    .toTable()
    .flatMap((result: unknown[]) => {
      const crime = result.at(-1);
      const year = result.at(-2);
      return !crime ? [] : [{ crime, year }];
    });

  return data as CrimeRate[];
}
