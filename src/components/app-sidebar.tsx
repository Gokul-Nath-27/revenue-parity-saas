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

const items = [
  {
    title: "Products",
    url: "#",
    icon: PackagePlus,
  },
  {
    title: "Analytics",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Subscriptions",
    url: "#",
    icon: CircleDollarSign,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
          <SidebarMenu className="w-full">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="default" isActive={item.title === "Products"}>
                    <a href={item.url} className="flex items-center" key={item.title}>
                      <Icon className="mr-2" size={300} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
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