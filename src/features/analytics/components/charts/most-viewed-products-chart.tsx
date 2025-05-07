"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { MostViewedProductData } from "../../actions";
import { HorizontalBarChartSkeleton as EmptyDataChart } from "../skeletons/chart-skeletons";


interface MostViewedProductsChartProps {
  data: MostViewedProductData[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "#f59e0b",
  },
} as const;

export function MostViewedProductsChart({
  data,
}: MostViewedProductsChartProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyDataChart
        title="Most Viewed Products"
        noDataMessage="No data available"
        pulse={false}
      />
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Most Viewed Products
      </h2>
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart data={data} accessibilityLayer layout="vertical">
          <CartesianGrid horizontal={false} />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            width={150}
          />
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