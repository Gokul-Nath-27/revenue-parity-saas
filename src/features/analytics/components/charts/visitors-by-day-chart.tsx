"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { VisitorsByDayData } from "@/features/analytics/actions";

import { LineChartSkeleton as EmptyDataChart } from "./chart-skeletons";

interface VisitorsByDayChartProps {
  data: VisitorsByDayData[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "#10b981",
  },
} as const;

export function VisitorsByDayChart({
  data,
}: VisitorsByDayChartProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyDataChart
        title="Visitors per Day"
        noDataMessage="No data available"
        pulse={false}
      />
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }));

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Visitors per Day
      </h2>
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <LineChart data={formattedData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Line
            dataKey="visitors"
            stroke="var(--color-visitors)"
            strokeWidth={2}
            dot={{ strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
} 