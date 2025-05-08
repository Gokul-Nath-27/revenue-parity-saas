"use client";

import { PieChart, Pie, Cell } from "recharts";

import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { VisitorsByParityGroupData } from "@/features/analytics/actions";

import { DonutChartSkeleton as EmptyDataChart } from "./chart-skeletons";
import { ChartWrapper } from "./chart-wrapper";

interface VisitorsByParityGroupChartProps {
  data: VisitorsByParityGroupData[];
}

export function VisitorsByParityGroupChart({
  data,
}: VisitorsByParityGroupChartProps) {

  console.log("VisitorsByParityGroupChart ", data);
  if (!data || data.length === 0) {
    return (
      <EmptyDataChart
        title="Visitors per Parity Group"
        noDataMessage="No data available"
        pulse={false}
      />
    );
  }

  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

  const totalVisitors = data.reduce((sum, entry) => sum + entry.visitors, 0);


  return (
    <div className="relative">
      <ChartWrapper title="Visitors per Parity Group">
        <PieChart>
          <Pie
            data={data}
            dataKey="visitors"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => `${name}: ${value} visitors`}
              />
            }
          />
        </PieChart>
      </ChartWrapper>
      <div className="p-4 absolute top-0 right-0">
        <div className="flex flex-col justify-center">
          <div className="text-sm text-gray-500 text-end">Total visitors</div>
          <div className="md:text-2xl font-bold text-end">{totalVisitors}</div>
        </div>
      </div>
    </div>
  );
} 