// In app-sidebar.tsx
import * as React from "react"
import {
  GlobeIcon,
  LayoutDashboard,
  PackagePlus,
  CircleDollarSign,
  ChevronsUpDown
} from "lucide-react"
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
import { getCurrentUser } from "@/server/actions/session"
import { redirect } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import NavMenu from "./nav-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { generateIntials } from "@/lib/utils"
import UserProfileDropdown from "./common/user-profile-dropdown"

const navigations = [
  {
    title: "Products",
    url: "/dashboard",
    icon: <PackagePlus size={16} />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <LayoutDashboard size={16} />,
  },
  {
    title: "Subscription",
    url: "/dashboard/subscription",
    icon: <CircleDollarSign size={16} />,
  },
]

const TriggerButton = ({ currentUser }: { currentUser: { name: string; email: string } }) => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg active:bg-sidebar-accent cursor-pointer">
      <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
        <AvatarImage src={""} alt={currentUser.name} />
        <AvatarFallback className="rounded-lg">{generateIntials(currentUser.name)}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{currentUser.name}</span>
        <span className="truncate text-xs">{currentUser.email}</span>
      </div>
      <ChevronsUpDown className="ml-auto size-4" />
    </div>
  );
};

export async function AppSidebarFooter() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/sign-in')
  return (
    <SidebarFooter>
      <UserProfileDropdown
        currentUser={currentUser}
        trigger={<TriggerButton currentUser={currentUser} />}
      />
    </SidebarFooter>
  )
}

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
              <Link href="/" className="h-10 cursor-pointer">
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
      <Suspense fallback={<div className="p-2"><Skeleton className="h-12 flex-1 rounded-xl bg-muted" /></div>}>
        <AppSidebarFooter />
      </Suspense>
      <SidebarRail />
    </Sidebar>
  )
}