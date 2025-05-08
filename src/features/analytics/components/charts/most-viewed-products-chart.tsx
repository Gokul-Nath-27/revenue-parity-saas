"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { MostViewedProductData } from "../../actions";

import { HorizontalBarChartSkeleton as EmptyDataChart } from "./chart-skeletons";
import { ChartWrapper } from "./chart-wrapper";


interface MostViewedProductsChartProps {
  data: MostViewedProductData[];
}

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
    <ChartWrapper title="Most Viewed Products">
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
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="visitors"
          fill="var(--color-visitors)"
          radius={4}
        />
      </BarChart>
    </ChartWrapper >
  );
} 