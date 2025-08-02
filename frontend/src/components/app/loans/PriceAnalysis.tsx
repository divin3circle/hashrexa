import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";

export const description =
  "Lending pool analytics showing collateral and stablecoin distribution";

const chartData = [
  { month: "Sep", collateral: 28500, hash: 12000 },
  { month: "Oct", collateral: 31200, hash: 13500 },
  { month: "Nov", collateral: 29800, hash: 12800 },
  { month: "Dec", collateral: 33400, hash: 14200 },
  { month: "Jan", collateral: 36100, hash: 15500 },
  { month: "Feb", collateral: 38700, hash: 16800 },
  { month: "Mar", collateral: 41200, hash: 18100 },
  { month: "Apr", collateral: 43800, hash: 19400 },
  { month: "May", collateral: 46500, hash: 20700 },
];

const chartConfig = {
  collateral: {
    label: "dAAPL Collateral",
    color: "#8B5CF6", // Purple
  },
  hash: {
    label: "HASH Stablecoin",
    color: "#ff9494", // Yellow
  },
} satisfies ChartConfig;

export function PriceAnalysis() {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[400px] w-full md:w-[100%]"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  {payload.map((entry, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {entry.name || "Unknown"}: $
                      {(entry.value as number).toLocaleString()}
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="collateral"
          stackId="a"
          fill="#8B5CF6"
          radius={[0, 0, 4, 4]}
          className=""
        />
        <Bar dataKey="hash" stackId="a" fill="#ff9494" radius={[8, 8, 2, 2]} />
      </BarChart>
    </ChartContainer>
  );
}
