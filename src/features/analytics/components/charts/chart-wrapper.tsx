import { ChartContainer } from "@/components/ui/chart";
const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "#f59e0b",
  },
} as const;

export function ChartWrapper({ children, title }: { children: React.ReactElement, title: string }) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">
        {title}
      </h2>
      <div className="relative">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          {children}
        </ChartContainer>
      </div>
    </div>
  );
}
