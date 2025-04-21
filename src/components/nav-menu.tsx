"use client"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  return (
    <SidebarMenu className="w-full">
      {navigations.map(({ title, url, icon }) => {
        const isActive = url === pathname;
        return (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton asChild size="default" isActive={isActive}>
              <Link href={url} className={cn("flex items-center justify-between cursor-pointer")} key={title} >
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