// In app-sidebar.tsx
import * as React from "react"
import {
  GlobeIcon,
  LayoutDashboard,
  PackagePlus,
  CircleDollarSign
} from "lucide-react"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Suspense } from "react"
import { getCurrentUser } from "@/server-actions/auth"
import { redirect } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import NavMenu from "./nav-menu"

const navigations = [
  {
    title: "Products",
    url: "/dashboard/products",
    icon: <PackagePlus />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <LayoutDashboard />,
  },
  {
    title: "Subscription",
    url: "/dashboard/subscription",
    icon: <CircleDollarSign />,
  },
]

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3"
            >
              <Link href="/" className="h-10">
                <GlobeIcon size={30} />
                <span className="font-bold text-xl">RevenueParity</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <NavMenu navigations={navigations} />
        </SidebarGroup>
      </SidebarContent>
      <Suspense fallback={<div className="p-2"><Skeleton className="h-12 flex-1 rounded-xl bg-muted/50" /></div>}>
        <AppSidebarFooter />
      </Suspense>
      <SidebarRail />
    </Sidebar>
  )
}

export async function AppSidebarFooter() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/sign-in')
  return (
    <SidebarFooter>
      <NavUser user={currentUser} />
    </SidebarFooter>
  )
}