"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation';

import LoadingIndicator from '@/components/loading-indicator'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";



type NavMenuProps = {
  navigations: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
}

export default function NavMenu({ navigations }: NavMenuProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarMenu className="w-full">
      {navigations.map(({ title, url, icon }) => {
        const isActive = url === pathname;
        return (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton asChild size="default" isActive={isActive}>
              <Link href={url} className={cn("flex items-center justify-between cursor-pointer")} key={title} onClick={() => setOpenMobile(false)}>
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