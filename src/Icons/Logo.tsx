import { Coffee } from "lucide-react"
import Link from "next/link"
type LogoProps = {
  to: string;
}
const Logo = ({ to }: LogoProps) => {
  return (
    <Link href={to}>
      <div className="flex items-center gap-2">
        <Coffee className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">RevenueParity</span>
      </div>
    </Link>
  )
}

export default Logo