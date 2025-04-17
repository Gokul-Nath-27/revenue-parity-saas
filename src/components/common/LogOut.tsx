"use client"
import { signoutAction } from "@/server/actions/auth"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { LogOut as LogOutIcon } from "lucide-react"

export default function LogOut() {
  return (
    <DropdownMenuItem onClick={() => signoutAction()}>
      <LogOutIcon />
      Logout
    </DropdownMenuItem>
  )
}