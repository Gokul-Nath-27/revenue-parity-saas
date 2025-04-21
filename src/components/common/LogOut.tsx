"use client"
import { signoutAction } from "@/server/actions/auth"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { LogOut as LogOutIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type LogOutProps = {
  className?: string;
}

export default function LogOut({ className }: LogOutProps) {
  return (
    <DropdownMenuItem onClick={() => signoutAction()} className={cn("cursor-pointer", className)}>
      <LogOutIcon />
      Logout
    </DropdownMenuItem>
  )
}