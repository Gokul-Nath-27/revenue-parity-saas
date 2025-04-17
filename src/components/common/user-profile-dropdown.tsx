"use client";
import { generateIntials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type UserProfileDropdownProps = {
  currentUser: { name: string; email: string };
  trigger: React.ReactNode;
}

export default function UserProfileDropdown({ currentUser, trigger }: UserProfileDropdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return trigger;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={"dawd"} alt={currentUser.name} />
              <AvatarFallback className="rounded-lg">{generateIntials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 t ext-left text-sm leading-tight">
              <span className="truncate font-medium">{currentUser.name}</span>
              <span className="truncate text-xs">{currentUser.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}