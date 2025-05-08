import { Metadata } from "next";
import { Suspense } from "react";

import DashboardHeader from "@/components/layout/dashboard-header";
import {
  LineChartSkeleton,
  HorizontalBarChartSkeleton,
  VerticalBarChartSkeleton,
  DonutChartSkeleton
} from "@/features/analytics/components/charts/chart-skeletons";
import {
  VisitorsByParityGroupData,
  VisitorsByCountryData,
  VisitorsByDayData,
  MostViewedProductsData
} from "@/features/analytics/components/server-charts";

export const metadata: Metadata = {
  title: "Analytics - RevenueParity",
  description: "View your analytics dashboard",
};

export default function AnalyticsPage() {
  return (
    <div className="flex h-full w-full flex-col gap-6">
      <DashboardHeader title="Analytics Dashboard" description="This is the analytics dashboard of your products.">
        <div className="grid grid-cols-1 gap-6">
          {/* Visitors by Day Chart */}
          <Suspense fallback={<LineChartSkeleton />}>
            <VisitorsByDayData />
          </Suspense>

          {/* Visitors by Parity Group Chart */}
          <Suspense fallback={<DonutChartSkeleton />}>
            <VisitorsByParityGroupData />
          </Suspense>

          {/* Most Viewed Products Chart */}
          <Suspense fallback={<HorizontalBarChartSkeleton />}>
            <MostViewedProductsData />
          </Suspense>

          {/* Visitors by Country Chart */}
          <Suspense fallback={<VerticalBarChartSkeleton />}>
            <VisitorsByCountryData />
          </Suspense>
        </div>
      </DashboardHeader>
    </div>
  );
}