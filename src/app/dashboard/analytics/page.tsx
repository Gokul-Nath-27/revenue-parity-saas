"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

// Sample data for different charts
const monthlyRevenueData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 9800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
]

const userGrowthData = [
  { month: "Jan", users: 400 },
  { month: "Feb", users: 600 },
  { month: "Mar", users: 800 },
  { month: "Apr", users: 1000 },
  { month: "May", users: 1200 },
  { month: "Jun", users: 1400 },
]

const productDistributionData = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 200 },
  { name: "Product D", value: 100 },
]

const conversionData = [
  { day: "Mon", rate: 2.5 },
  { day: "Tue", rate: 3.2 },
  { day: "Wed", rate: 2.8 },
  { day: "Thu", rate: 3.5 },
  { day: "Fri", rate: 4.0 },
  { day: "Sat", rate: 3.7 },
  { day: "Sun", rate: 3.0 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
  expenses: {
    label: "Expenses",
    color: "#dc2626",
  },
  users: {
    label: "Users",
    color: "#16a34a",
  },
  rate: {
    label: "Conversion Rate",
    color: "#9333ea",
  },
} as const

export default function AnalyticsPage() {
  return (
    <div className="flex h-full w-full flex-col gap-6 md:p-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Revenue vs Expenses Chart */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Revenue vs Expenses</h2>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* User Growth Chart */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">User Growth</h2>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <LineChart data={userGrowthData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Product Distribution Chart */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Product Distribution</h2>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <PieChart>
              <Pie
                data={productDistributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </div>

        {/* Conversion Rate Chart */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Conversion Rate</h2>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <LineChart data={conversionData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}