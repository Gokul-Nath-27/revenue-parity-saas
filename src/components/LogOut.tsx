import { LogOut as LogOutIcon } from "lucide-react"
import { redirect } from "next/navigation";
import { useTransition } from "react"

import { signout } from "@/features/account/actions"

import { Button } from "./ui/button"


export default function LogOut() {
  const [pending, startTransition] = useTransition();

  const handleOnClick = () => {
    startTransition(async () => {
      await signout()
      redirect('/')
    })
  }

  return (
    <Button type="submit" className="w-full cursor-pointer mt-1" onClick={handleOnClick}>
      <LogOutIcon />
      Logout
      {pending && <div
        role="status"
        aria-label="Loading"
        className="spinner-dark-mode size-4 shrink-0 rounded-full"
      />}
    </Button>
  )
}