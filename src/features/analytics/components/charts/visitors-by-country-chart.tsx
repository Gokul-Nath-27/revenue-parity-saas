"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { VisitorsByCountryData } from "@/features/analytics/actions";

import { VerticalBarChartSkeleton as EmptyDataChart } from "./chart-skeletons";

interface VisitorsByCountryChartProps {
  data: VisitorsByCountryData[];
}

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

  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

  const chartConfig = {
    visitors: {
      label: "Visitors",
      color: "#f59e0b",
    },
  } as const;

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Top 10 Countries by Visitors
      </h2>
      <div className="relative">
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
            <ChartTooltip

              content={<ChartTooltipContent formatter={(value, name) => `${name}: ${value} visitors`} />} />
            <Bar
              dataKey="visitors"
              radius={4}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
} 