"use client"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LoadingIndicator from './loading-indicator'
import Link from 'next/link'


type NavMenuProps = {
  navigations: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
}

export default function NavMenu({ navigations }: NavMenuProps) {

  return (
    <SidebarMenu className="w-full">
      {navigations.map(({ title, url, icon }) => {
        return (
          <SidebarMenuItem key={title} >
            <SidebarMenuButton asChild size="default">
              <Link href={url} className={cn("flex items-center justify-between")} key={title} >
                <div className="flex items-center gap-2">
                  {icon}
                  <span>{title}</span>
                </div>
                <LoadingIndicator />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  )
}