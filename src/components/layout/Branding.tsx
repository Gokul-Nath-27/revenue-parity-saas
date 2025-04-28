"use client"
import { GlobeIcon } from "lucide-react";
import Link from "next/link";

import { useSidebar } from "../ui/sidebar";

export default function Branding() {
  const { setOpenMobile } = useSidebar()
  return (
    <Link href="/dashboard" className="h-10 cursor-pointer flex items-center gap-1 ml-1" onClick={() => setOpenMobile(false)}>
      <GlobeIcon size={20} />
      <span className="font-bold text-xl">RevenueParity</span>
    </Link>
  )
}