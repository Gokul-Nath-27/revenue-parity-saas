"use client"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

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
        const isActive = pathname === url
        return (
          <SidebarMenuItem key={title} >
            <SidebarMenuButton asChild size="default" isActive={isActive}>
              <a href={url} className={cn("flex items-center")} key={title} >
                {icon}
                <span>{title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  )
}