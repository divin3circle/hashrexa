import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { usePriceAnalysis } from "@/hooks/usePriceAnalysis";
import { Loader2 } from "lucide-react";

export const description =
  "Lending pool analytics showing collateral and stablecoin distribution";

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
  const { data: chartData, isLoading, error } = usePriceAnalysis();
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-gray-500">Error: {error.message}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[400px] w-full md:w-[100%]"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="hour"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
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
