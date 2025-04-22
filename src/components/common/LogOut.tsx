import { signout } from "@/server/actions/auth"
import { LogOut as LogOutIcon } from "lucide-react"
import { useTransition } from "react"
import { Button } from "../ui/button"
import { redirect } from "next/navigation";

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