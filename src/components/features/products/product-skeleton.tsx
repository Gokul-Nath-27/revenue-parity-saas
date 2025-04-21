import { Skeleton } from "@/components/ui/skeleton";

export const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative bg-gradient-to-b from-card to-background border border-border/80 rounded-2xl p-4 w-full max-w-sm"
        >
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-7 w-32 mb-1 bg-muted/80" />
                <Skeleton className="h-4 w-48 bg-muted/80" />
              </div>
              <Skeleton className="h-8 w-8 rounded-lg bg-muted/80" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20 bg-muted/80" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
