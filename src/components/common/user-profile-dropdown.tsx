"use client";
import { cn, generateIntials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import LogOut from "@/components/common/LogOut";
import { useRouter } from 'next/navigation'

type UserProfileDropdownProps = {
  currentUser: { name: string; email: string };
  trigger: React.ReactNode;
  isMobile?: boolean;
}

export default function UserProfileDropdown({ currentUser, trigger, isMobile }: UserProfileDropdownProps) {
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
          <DropdownMenuItem onClick={() => router.push("/dashboard/subscription")} className="cursor-pointer">
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
          <LogOut className="cursor-pointer" />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}