import DonutSVG from "@/assets/Icons/DonutSVG";
import LineChartGradient from "@/assets/Icons/LineChartGradient";
import { Skeleton } from "@/components/ui/skeleton";
export function LineChartSkeleton({ title, noDataMessage, pulse = true }: { title?: string, noDataMessage?: string, pulse?: boolean }) {
  return (
    <div className="md:col-span-2 rounded-lg border p-4">
      {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : <Skeleton className="h-6 w-36 mb-6" pulse={pulse} />}

      {noDataMessage && <p className="text-sm text-muted-foreground mb-4">{noDataMessage}</p>}

      <div className="flex flex-col">
        <div className="relative h-[250px] w-full">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {[...Array(4)].map((_, i) => (
              <div key={`h-${i}`} className="w-full h-[1px] bg-muted/30 self-end" />
            ))}
            {[...Array(4)].map((_, i) => (
              <div key={`v-${i}`} className="h-full w-[1px] bg-muted/30 justify-self-end" />
            ))}
          </div>

          {/* Main axes */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-muted" />
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-muted" />

          {/* Area under the curve */}
          <div className="absolute inset-4 opacity-30">
            <LineChartGradient />
          </div>

          {/* Data points */}
          <div className="absolute inset-4">
            <div className="relative h-full w-full">
              <Skeleton className="absolute rounded-full h-2 w-2 left-[0%] top-[70%]" pulse={pulse} />
              <Skeleton className="absolute rounded-full h-2 w-2 left-[25%] top-[40%]" pulse={pulse} />
              <Skeleton className="absolute rounded-full h-2 w-2 left-[50%] top-[35%]" pulse={pulse} />
              <Skeleton className="absolute rounded-full h-2 w-2 left-[75%] top-[15%]" pulse={pulse} />
              <Skeleton className="absolute rounded-full h-2 w-2 left-[100%] top-[25%]" pulse={pulse} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VerticalBarChartSkeleton({
  title,
  noDataMessage,
  pulse = true
}: {
  pulse?: boolean,
  title?: string,
  noDataMessage?: string
}) {
  return (
    <div className="md:col-span-2 rounded-lg border p-4">
      {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : <Skeleton className="h-6 w-36 mb-6" />}

      {noDataMessage && <p className="text-sm text-muted-foreground mb-4">{noDataMessage}</p>}

      <div className="flex flex-col">
        <div className="relative h-[250px] w-full">
          {/* Axes */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-muted" />
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-muted" />

          {/* bars */}
          <div className="flex justify-around absolute bottom-1 left-8 right-8 h-[80%]">
            <Skeleton className={`w-[7%] h-[60%] self-end`} pulse={pulse} />
            <Skeleton className={`w-[7%] h-[40%] self-end`} pulse={pulse} />
            <Skeleton className={`w-[7%] h-[75%] self-end`} pulse={pulse} />
            <Skeleton className={`w-[7%] h-[25%] self-end`} pulse={pulse} />
            <Skeleton className={`w-[7%] h-[50%] self-end`} pulse={pulse} />
            <Skeleton className={`w-[7%] h-[35%] self-end`} pulse={pulse} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HorizontalBarChartSkeleton({ title, noDataMessage, pulse = true }: { title?: string, noDataMessage?: string, pulse?: boolean }) {
  return (
    <div className="md:col-span-2 rounded-lg border p-4">
      {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : <Skeleton className="h-6 w-36 mb-6" pulse={pulse} />}

      {noDataMessage && <p className="text-sm text-muted-foreground mb-4">{noDataMessage}</p>}

      <div className="flex flex-col">
        <div className="relative h-[250px] w-full">
          {/* Grid lines */}
          <div className="absolute inset-x-[70px] inset-y-4 grid grid-cols-4">
            {[...Array(5)].map((_, i) => (
              <div key={`v-${i}`} className="h-full w-[1px] bg-muted/30 justify-self-end" />
            ))}
          </div>

          {/* Main axes */}
          <div className="absolute bottom-0 left-[70px] right-4 h-[1px] bg-muted" />
          <div className="absolute top-4 bottom-0 left-[70px] w-[1px] bg-muted" />

          {/* Bars with labels */}
          <div className="absolute inset-y-4 inset-x-0 flex flex-col justify-around">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center h-8">
                <div className="w-[70px] pr-3 flex justify-end">
                  <Skeleton className={`h-3 w-${12 + i * 2}`} pulse={pulse} />
                </div>
                <div className="h-full flex-1">
                  <Skeleton className={`h-full w-[${35 + i * 10}%] rounded-r-md`} pulse={pulse} />
                </div>
              </div>
            ))}
          </div>

          {/* X-axis ticks */}
          <div className="absolute bottom-[-10px] left-[70px] right-4 flex justify-between">
            <div className="h-2 w-[1px] bg-muted/50"></div>
            <div className="h-2 w-[1px] bg-muted/50"></div>
            <div className="h-2 w-[1px] bg-muted/50"></div>
            <div className="h-2 w-[1px] bg-muted/50"></div>
            <div className="h-2 w-[1px] bg-muted/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DonutChartSkeleton({ title, noDataMessage, pulse = true }: { title?: string, noDataMessage?: string, pulse?: boolean }) {
  return (
    <div className="md:col-span-2 rounded-lg border p-4">
      {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : <Skeleton className="h-6 w-36 mb-6" pulse={pulse} />}

      {noDataMessage && <p className="text-sm text-muted-foreground mb-4">{noDataMessage}</p>}

      <div className="flex flex-col items-center justify-center">
        <div className="relative h-[200px] w-[200px]">
          {/* Donut chart background */}
          <DonutSVG pulse={pulse} />

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center bg-muted/10">
              <Skeleton className="h-10 w-10 rounded-full" pulse={pulse} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-4 gap-3 w-full max-w-[240px]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-muted/50" />
              <Skeleton className="h-3 w-8" pulse={pulse} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 