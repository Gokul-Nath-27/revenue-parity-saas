import { cn } from "@/lib/utils"

function Skeleton({ className, pulse = true, ...props }: React.ComponentProps<"div"> & { pulse?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent rounded-md", className, pulse && "animate-pulse")}
      {...props}
    />
  )
}

export { Skeleton }
