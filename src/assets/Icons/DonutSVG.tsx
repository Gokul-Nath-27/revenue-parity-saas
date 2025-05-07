export default function DonutSVG({ pulse }: { pulse: boolean }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 100 100">
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="hsl(var(--foreground))"
        stroke="hsl(var(--foreground))"
        strokeWidth="12"
        className="opacity-20"
      />

      {/* Donut segments with pulse animation */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="var(--chart-4)"
        strokeWidth="12"
        strokeDasharray="66 198"
        strokeDashoffset="0"
        className={`opacity-70 ${pulse ? 'animate-pulse' : ''}`}
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="var(--chart-3)"
        strokeWidth="12"
        strokeDasharray="48 216"
        strokeDashoffset="78"
        className={`opacity-60 ${pulse ? 'animate-pulse' : ''}`}
        style={{ animationDelay: "300ms" }}
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth="12"
        strokeDasharray="36 228"
        strokeDashoffset="138"
        className={`opacity-50 ${pulse ? 'animate-pulse' : ''}`}
        style={{ animationDelay: "600ms" }}
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="12"
        strokeDasharray="42 222"
        strokeDashoffset="186"
        className={`opacity-40 ${pulse ? 'animate-pulse' : ''}`}
        style={{ animationDelay: "900ms" }}
      />

      {/* Transparent white center to create the donut hole */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="hsl(var(--background))"
      />
    </svg>
  )
}