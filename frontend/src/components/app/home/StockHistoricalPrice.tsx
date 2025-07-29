"use client";

import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", earnings: 222, interest: 150 },
  { date: "2024-04-02", earnings: 97, interest: 180 },
  { date: "2024-04-03", earnings: 167, interest: 120 },
  { date: "2024-04-04", earnings: 242, interest: 260 },
  { date: "2024-04-05", earnings: 373, interest: 290 },
  { date: "2024-04-06", earnings: 301, interest: 340 },
  { date: "2024-04-07", earnings: 245, interest: 180 },
  { date: "2024-04-08", earnings: 409, interest: 320 },
  { date: "2024-04-09", earnings: 159, interest: 110 },
  { date: "2024-04-10", earnings: 261, interest: 190 },
  { date: "2024-04-11", earnings: 327, interest: 350 },
  { date: "2024-04-12", earnings: 292, interest: 210 },
  { date: "2024-04-13", earnings: 342, interest: 380 },
  { date: "2024-04-14", earnings: 137, interest: 220 },
  { date: "2024-04-15", earnings: 120, interest: 170 },
  { date: "2024-04-16", earnings: 138, interest: 190 },
  { date: "2024-04-17", earnings: 446, interest: 360 },
  { date: "2024-04-18", earnings: 364, interest: 410 },
  { date: "2024-04-19", earnings: 243, interest: 180 },
  { date: "2024-04-20", earnings: 189, interest: 150 },
  { date: "2024-04-21", earnings: 137, interest: 200 },
  { date: "2024-04-22", earnings: 224, interest: 170 },
  { date: "2024-04-23", earnings: 138, interest: 230 },
  { date: "2024-04-24", earnings: 387, interest: 290 },
  { date: "2024-04-25", earnings: 215, interest: 250 },
  { date: "2024-04-26", earnings: 75, interest: 130 },
  { date: "2024-04-27", earnings: 383, interest: 420 },
  { date: "2024-04-28", earnings: 122, interest: 180 },
  { date: "2024-04-29", earnings: 315, interest: 240 },
  { date: "2024-04-30", earnings: 454, interest: 380 },
  { date: "2024-05-01", earnings: 165, interest: 220 },
  { date: "2024-05-02", earnings: 293, interest: 310 },
  { date: "2024-05-03", earnings: 247, interest: 190 },
  { date: "2024-05-04", earnings: 385, interest: 420 },
  { date: "2024-05-05", earnings: 481, interest: 390 },
  { date: "2024-05-06", earnings: 498, interest: 520 },
  { date: "2024-05-07", earnings: 388, interest: 300 },
  { date: "2024-05-08", earnings: 149, interest: 210 },
  { date: "2024-05-09", earnings: 227, interest: 180 },
  { date: "2024-05-10", earnings: 293, interest: 330 },
  { date: "2024-05-11", earnings: 335, interest: 270 },
  { date: "2024-05-12", earnings: 197, interest: 240 },
  { date: "2024-05-13", earnings: 197, interest: 160 },
  { date: "2024-05-14", earnings: 448, interest: 490 },
  { date: "2024-05-15", earnings: 473, interest: 380 },
  { date: "2024-05-16", earnings: 338, interest: 400 },
  { date: "2024-05-17", earnings: 499, interest: 420 },
  { date: "2024-05-18", earnings: 315, interest: 350 },
  { date: "2024-05-19", earnings: 235, interest: 180 },
  { date: "2024-05-20", earnings: 177, interest: 230 },
  { date: "2024-05-21", earnings: 182, interest: 140 },
  { date: "2024-05-22", earnings: 181, interest: 120 },
  { date: "2024-05-23", earnings: 252, interest: 290 },
  { date: "2024-05-24", earnings: 294, interest: 220 },
  { date: "2024-05-25", earnings: 201, interest: 250 },
  { date: "2024-05-26", earnings: 213, interest: 170 },
  { date: "2024-05-27", earnings: 420, interest: 460 },
  { date: "2024-05-28", earnings: 233, interest: 190 },
  { date: "2024-05-29", earnings: 278, interest: 130 },
  { date: "2024-05-30", earnings: 340, interest: 280 },
  { date: "2024-05-31", earnings: 178, interest: 230 },
  { date: "2024-06-01", earnings: 178, interest: 200 },
  { date: "2024-06-02", earnings: 470, interest: 410 },
  { date: "2024-06-03", earnings: 103, interest: 160 },
  { date: "2024-06-04", earnings: 439, interest: 380 },
  { date: "2024-06-05", earnings: 288, interest: 140 },
  { date: "2024-06-06", earnings: 294, interest: 250 },
  { date: "2024-06-07", earnings: 323, interest: 370 },
  { date: "2024-06-08", earnings: 385, interest: 320 },
  { date: "2024-06-09", earnings: 438, interest: 480 },
  { date: "2024-06-10", earnings: 155, interest: 200 },
  { date: "2024-06-11", earnings: 192, interest: 150 },
  { date: "2024-06-12", earnings: 492, interest: 420 },
  { date: "2024-06-13", earnings: 281, interest: 130 },
  { date: "2024-06-14", earnings: 426, interest: 380 },
  { date: "2024-06-15", earnings: 307, interest: 350 },
  { date: "2024-06-16", earnings: 371, interest: 310 },
  { date: "2024-06-17", earnings: 475, interest: 520 },
  { date: "2024-06-18", earnings: 107, interest: 170 },
  { date: "2024-06-19", earnings: 341, interest: 290 },
  { date: "2024-06-20", earnings: 408, interest: 450 },
  { date: "2024-06-21", earnings: 169, interest: 210 },
  { date: "2024-06-22", earnings: 317, interest: 270 },
  { date: "2024-06-23", earnings: 480, interest: 530 },
  { date: "2024-06-24", earnings: 132, interest: 180 },
  { date: "2024-06-25", earnings: 141, interest: 190 },
  { date: "2024-06-26", earnings: 434, interest: 380 },
  { date: "2024-06-27", earnings: 448, interest: 490 },
  { date: "2024-06-28", earnings: 149, interest: 200 },
  { date: "2024-06-29", earnings: 103, interest: 160 },
  { date: "2024-06-30", earnings: 446, interest: 400 },
];

const chartConfig = {
  portfolio: {
    label: "Portfolio",
  },
  earnings: {
    label: "Earnings",
    color: "#ADD8E6",
  },
  interest: {
    label: "Interest",
    color: "#ff9494",
  },
} satisfies ChartConfig;

export function StockHistoricalPrice() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0 shadow-none border border-gray-200 rounded-3xl">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-xl font-bold">
            Portfolio Performance
          </CardTitle>
          <CardDescription>
            Showing portfolio performance for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillearnings" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-earnings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="55%"
                  stopColor="var(--color-earnings)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillinterest" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-interest)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="55%"
                  stopColor="var(--color-interest)"
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
              tickFormatter={(value) => `$${value}`}
              minTickGap={32}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="interest"
              type="natural"
              fill="url(#fillinterest)"
              stroke="var(--color-interest)"
              stackId="a"
            />
            <Area
              dataKey="earnings"
              type="natural"
              fill="url(#fillearnings)"
              stroke="var(--color-earnings)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
