import { Skeleton } from "@/components/ui/skeleton";

export const ProductCustomizationSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Tabs Content Skeleton */}
      <div className="space-y-4">
        {/* Site Config Panel Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-muted/80" />
          <div className="grid gap-4">
            <Skeleton className="h-10 w-full bg-muted/80" />
            <Skeleton className="h-10 w-full bg-muted/80" />
            <Skeleton className="h-10 w-full bg-muted/80" />
          </div>
        </div>

        {/* Banner Panel Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-muted/80" />
          <div className="grid gap-4">
            <Skeleton className="h-32 w-full bg-muted/80" />
            <Skeleton className="h-10 w-full bg-muted/80" />
            <Skeleton className="h-10 w-full bg-muted/80" />
          </div>
        </div>

        {/* Discounts Panel Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-muted/80" />
          <div className="grid gap-4">
            <Skeleton className="h-10 w-full bg-muted/80" />
            <Skeleton className="h-10 w-full bg-muted/80" />
            <Skeleton className="h-10 w-full bg-muted/80" />
          </div>
        </div>
      </div>
    </div>
  );
}; 