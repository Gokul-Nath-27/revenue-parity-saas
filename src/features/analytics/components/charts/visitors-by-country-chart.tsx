"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { VisitorsByCountryData } from "@/features/analytics/actions";

import { VerticalBarChartSkeleton as EmptyDataChart } from "../skeletons/chart-skeletons";

interface VisitorsByCountryChartProps {
  data: VisitorsByCountryData[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "#34d399",
  },
} as const;

export function VisitorsByCountryChart({
  data,
}: VisitorsByCountryChartProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyDataChart
        title="Top 10 Countries by Visitors"
        noDataMessage="No data available"
        pulse={false}
      />
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Top 10 Countries by Visitors
      </h2>
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Bar
            dataKey="visitors"
            fill="var(--color-visitors)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
} 