import { Area, AreaChart, CartesianGrid } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Interest rate trends over time";

const chartData = [
  { month: "Jan", rate: 5.2 },
  { month: "Feb", rate: 6.1 },
  { month: "Mar", rate: 5.7 },
  { month: "Apr", rate: 7.1 },
  { month: "May", rate: 6.3 },
  { month: "Jun", rate: 7.0 },
  { month: "Jul", rate: 5.4 },
  { month: "Aug", rate: 6.2 },
  { month: "Sep", rate: 5.9 },
  { month: "Oct", rate: 7.2 },
  { month: "Nov", rate: 5.7 },
  { month: "Dec", rate: 6.5 },
];

const chartConfig = {
  rate: {
    label: "Interest Rate",
    color: "#ff9494",
  },
} satisfies ChartConfig;

export function RatesChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[230px]">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff9494" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ff9494" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="rate"
          type="natural"
          fill="url(#fillRate)"
          fillOpacity={0.4}
          stroke="#ff9494"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
