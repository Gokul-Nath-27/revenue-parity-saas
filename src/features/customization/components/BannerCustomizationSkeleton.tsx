// BannerCustomizationLoading.tsx
export default function BannerCustomizationLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Preview skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-16 w-full bg-muted rounded" />
      </div>

      {/* Grid layout skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Appearance form skeleton */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="space-y-2">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-10 w-full bg-muted rounded" />
            ))}
          </div>
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        {/* Embed card skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="space-y-2">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-4 w-full bg-muted rounded" />
            ))}
          </div>
          <div className="h-10 w-full bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
