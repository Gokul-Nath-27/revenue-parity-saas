"use client";
import { Home, Sparkles } from "lucide-react";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

import LogOut from "@/components/LogOut";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn, generateIntials } from "@/lib/utils";

type UserProfileDropdownProps = {
  user: { name: string; email: string };
  trigger: React.ReactNode;
  isMobile?: boolean;
}

export default function UserProfileDropdown({ user, trigger, isMobile }: UserProfileDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return trigger;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("cursor-pointer", isMobile && "mr-4")}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="rounded-lg">{generateIntials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 t ext-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/subscription")}>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/")}>
            <Home />
            Go to Marketing Page
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <LogOut />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}