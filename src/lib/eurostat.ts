import JSONstat from "jsonstat-toolkit";

const HOST =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

type Inflation = {
  inflation: number;
  year: string;
};

export async function getInflation() {
  const dataSetCode = "prc_hicp_manr";
  const params = new URLSearchParams({
    geo: "EU",
    unit: "RCH_A",
    coicop: "CP00",
  });

  const url = `${HOST}/${dataSetCode}?${params.toString()}`;
  const jst = await JSONstat(url);
  const data = jst
    .Dataset(0)
    .toTable()
    .map((result: unknown[]) => ({
      inflation: result.at(-1),
      year: result.at(4),
    }));

  console.dir(data, { depth: null });
  return data as Inflation[];
}
