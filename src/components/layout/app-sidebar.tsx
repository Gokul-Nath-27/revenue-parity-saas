import {
  LayoutDashboard,
  PackagePlus,
  CircleDollarSign,
  ChevronsUpDown
} from "lucide-react"
import { redirect } from "next/navigation"
import { Suspense } from "react"

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
import UserProfileDropdown from "@/components/user-profile-dropdown"
import { getSessionIdFromCookie, getUser } from "@/lib/session"
import { generateIntials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Skeleton } from "../ui/skeleton"

import Branding from "./Branding"
import NavMenu from "./nav-menu"


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

const TriggerButton = ({ user }: { user: { name: string; email: string } }) => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg active:bg-sidebar-accent cursor-pointer">
      <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
        <AvatarImage src={""} alt={user.name} />
        <AvatarFallback className="rounded-lg">{generateIntials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
      <ChevronsUpDown className="ml-auto size-4" />
    </div>
  );
};

export async function AppSidebarFooter() {
  const user = await getUser(await getSessionIdFromCookie());
  if (!user) redirect('/sign-in')
  return (
    <SidebarFooter>
      <UserProfileDropdown
        user={user}
        trigger={<TriggerButton user={user} />}
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
              <Branding />
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