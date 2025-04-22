"use client"
import { signout } from "@/server/actions/auth"
import { LogOut as LogOutIcon } from "lucide-react"
import { useActionState } from "react"
import { Button } from "../ui/button"

export default function LogOut() {
  const [_, action, pending] = useActionState(signout, undefined);

  return (
    <form action={action}>
      <Button type="submit" className="w-full cursor-pointer mt-1">
        <LogOutIcon />
        Logout
        {pending && <div
          role="status"
          aria-label="Loading"
          className="spinner-dark-mode ml-auto size-4 shrink-0 rounded-full"
        />}
      </Button>
    </form>
  )
}