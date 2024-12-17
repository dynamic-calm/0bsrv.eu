import MyLineChart from "@/app/components/line-chart";
import { getInflation } from "@/lib/eurostat";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default async function Home() {
  const data = await getInflation();
  return (
    <main className="mx-auto min-h-screen w-full p-2">
      <div className="grid h-full w-full grid-cols-3 gap-2">
        <div className="col-span-3 flex h-28 w-full gap-2">
          {new Array(4).fill(0).map((_, i) => (
            <div
              key={i}
              className="flex w-full items-center justify-center rounded-sm border border-gray-600 font-mono text-5xl"
            >
              {Intl.NumberFormat("en-US").format(
                Math.floor(Math.random() * 3000),
              )}
            </div>
          ))}
        </div>
        {new Array(10).fill(0).map((_, i) => (
          <div className="h-64 w-full rounded-sm border border-gray-600 font-mono text-xs">
            <div className="flex h-8 w-full items-center justify-center border-b border-neutral-700">
              <span className="block font-sans text-sm font-semibold">
                Inflation
              </span>
            </div>
            <MyLineChart
              key={i}
              data={data}
              XAxisKey="year"
              LineKey="inflation"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
