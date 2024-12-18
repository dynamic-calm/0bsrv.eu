import JSONstat from "jsonstat-toolkit";

const HOST =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

type Result = {
  time: string;
  value: number;
  geo: string;
};

export async function getInflation() {
  const eu =
    "european union (eu6-1958, eu9-1973, eu10-1981, eu12-1986, eu15-1995, eu25-2004, eu27-2007, eu28-2013, eu27-2020)";

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
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === eu ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: Result, b: Result) => a.time.localeCompare(b.time));

  const inflation = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    inflation.push(dataPerTime);
  }

  return inflation;
}

export async function getGDPGrowth() {
  const eu =
    "euro area (ea11-1999, ea12-2001, ea13-2007, ea15-2008, ea16-2009, ea17-2011, ea18-2014, ea19-2015, ea20-2023)";

  const dataSetCode = "namq_10_gdp";
  const params = new URLSearchParams({
    unit: "CLV_PCH_PRE",
    s_adj: "SCA",
    na_item: "B1GQ",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === eu ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const gdp = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    gdp.push(dataPerTime);
  }

  console.log("gdp", gdp);

  return gdp as Result[];
}

export async function getUnemployment() {
  const eu = "european union - 27 countries (from 2020)";
  const dataSetCode = "une_rt_m";
  const params = new URLSearchParams({
    unit: "PC_ACT",
    s_adj: "SA",
    age: "TOTAL",
    sex: "T",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === eu ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const unemployment = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    unemployment.push(dataPerTime);
  }

  return unemployment;
}

export async function getHousePriceIndex() {
  const eu =
    "european union (eu6-1958, eu9-1973, eu10-1981, eu12-1986, eu15-1995, eu25-2004, eu27-2007, eu28-2013, eu27-2020)";

  const dataSetCode = "prc_hpi_q";
  const params = new URLSearchParams({
    purchase: "TOTAL",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === eu ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const housePriceIndex = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    housePriceIndex.push(dataPerTime);
  }

  return housePriceIndex;
}

export async function getPopulationGrowth() {
  const eu = "european economic area (eu28 - 2013-2020 and is, li, no)";
  const dataSetCode = "demo_gind";
  const params = new URLSearchParams({
    indic_de: "GROWRT",
    lang: "en",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === eu ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const populationGrowth = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    populationGrowth.push(dataPerTime);
  }

  return populationGrowth;
}

export async function getDeaths() {
  const eu = "european union - 27 countries (from 2020)";
  const dataSetCode = "demo_gind";
  const params = new URLSearchParams({
    indic_de: "DEATH",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === eu ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const deaths = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    deaths.push(dataPerTime);
  }

  return deaths;
}

export async function getPopulation() {
  const eu = "euro area – 20 countries (from 2023)";
  const dataSetCode = "demo_gind";
  const params = new URLSearchParams({ indic_de: "AVG" });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === eu ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const population = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    population.push(dataPerTime);
  }

  return population;
}

export async function getCrimeRate() {
  const eu = "euro area – 20 countries (from 2023)";
  const dataSetCode = "ilc_mddw03";
  const params = new URLSearchParams({
    unit: "PC",
    hhtyp: "TOTAL",
    incgrp: "TOTAL",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === eu ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const crime = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    crime.push(dataPerTime);
  }
  console.log(crime);
  return crime;
}
