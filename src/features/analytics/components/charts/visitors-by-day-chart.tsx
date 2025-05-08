"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { VisitorsByDayData } from "@/features/analytics/actions";

import { LineChartSkeleton as EmptyDataChart } from "./chart-skeletons";
import { ChartWrapper } from "./chart-wrapper";

interface VisitorsByDayChartProps {
  data: VisitorsByDayData[];
}

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
    <ChartWrapper title="Visitors per Day">
      <LineChart data={formattedData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="visitors"
          stroke="var(--color-visitors)"
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartWrapper >
  );
} 