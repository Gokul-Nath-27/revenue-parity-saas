"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { VisitorsByParityGroupData } from "@/features/analytics/actions";

import { DonutChartSkeleton as EmptyDataChart } from "./chart-skeletons";

interface VisitorsByParityGroupChartProps {
  data: VisitorsByParityGroupData[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "#60a5fa",
  },
} as const;

export function VisitorsByParityGroupChart({
  data,
}: VisitorsByParityGroupChartProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyDataChart
        title="Visitors per Parity Group"
        noDataMessage="No data available"
        pulse={false}
      />
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Visitors per Parity Group
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