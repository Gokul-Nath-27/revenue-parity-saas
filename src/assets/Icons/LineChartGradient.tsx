export default function LineChartGradient() {
  return (
    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path
        d="M0,70 C15,65 30,40 45,35 C60,30 75,15 100,25 L100,100 L0,100 Z"
        fill="url(#lineGradient)"
      />
      <path
        d="M0,70 C15,65 30,40 45,35 C60,30 75,15 100,25"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.5"
        fill="none"
      />
    </svg>
  )
}