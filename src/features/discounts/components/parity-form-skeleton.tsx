import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ParityFormSkeleton() {
  return (
    <div className="flex flex-col gap-6 md:grid md:grid-cols-2 animate-pulse">
      {Array(10).fill(0).map((_, i) => (
        <Card className="relative overflow-hidden" key={i}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
          <div className="relative z-10">
            <CardHeader className="pb-2 space-y-2">
              <div className="h-5 w-40 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5 min-h-[60px] p-3 bg-muted/30 rounded-md">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 w-10 bg-muted rounded" />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-10 bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-10 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
};
