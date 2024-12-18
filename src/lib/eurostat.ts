import JSONstat from "jsonstat-toolkit";

const HOST =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

type Result = {
  time: string;
  value: number;
  geo: string;
};

type GetData = {
  dataSetCode: string;
  params: Record<string, string>;
  euKey: string;
};

export async function getData({ dataSetCode, params, euKey }: GetData) {
  const url = `${HOST}/${dataSetCode}?${new URLSearchParams(params).toString()}`;
  const jst = await JSONstat(url);
  const timeIds = jst.Dataset(0).Dimension("time").id;
  const data = jst
    .Dataset(0)
    .toTable({ type: "arrobj" })
    .map((result: Result) => ({
      ...result,
      [result.geo.toLowerCase() === euKey ? "eu" : result.geo.toLowerCase()]:
        result.value,
    }))
    .sort((a: { time: string }, b: { time: string }) =>
      a.time.localeCompare(b.time),
    );

  const result = [];
  for (const timeId of timeIds) {
    const dataPerTime = data.reduce(
      (acc: Result, item: Result) =>
        item.time === timeId ? { ...acc, ...item } : acc,
      {},
    );

    result.push(dataPerTime);
  }

  return result;
}
