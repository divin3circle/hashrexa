import { Area, AreaChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useHistorical } from "@/hooks/useStocks";
import { Loader2 } from "lucide-react";

const chartConfig = {
  equity: {
    label: "Portfolio Value",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export function StockHistoricalPrice() {
  const { data: portfolioData, isLoading, error } = useHistorical();

  if (isLoading)
    return (
      <div className="flex items-center flex-col justify-center h-[570px] border border-gray-300 rounded-3xl">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  if (!portfolioData) return <div>No data found</div>;

  const filteredData = portfolioData;

  return (
    <Card className="pt-0 shadow-none border border-gray-300 rounded-3xl bg-[#fffdf6]">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-xl font-bold">
            Portfolio Historical Performance
          </CardTitle>
          <CardDescription>
            Showing portfolio value performance for the selected time period
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillequity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-equity)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="0%"
                  stopColor="var(--color-equity)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              minTickGap={32}
              domain={[98000, 100000]}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="equity"
              type="natural"
              fill="url(#fillequity)"
              stroke="var(--color-equity)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
