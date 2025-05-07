"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import SubmitButton from "@/components/SubmitButton"
import { Input } from "@/components/ui/input"
import { forgotPassword } from "@/features/account/actions"


export default function ForgotPasswordForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(forgotPassword, {})

  useEffect(() => {
    if (state?.message && !pending) {
      if (state.error) {
        toast.error(state.message)
      } else {
        toast.success(state.message)
        router.push("/sign-in")
      }
    }
  }, [state, pending, router])

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <Input
          id="email"
          placeholder="m@example.com"
          type="email"
          name="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          required
        />
      </div>
      <SubmitButton text="Send reset link" loadingText="Sending..." />
      <div className="text-center">
        <Link href="/sign-in" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </form>
  )
}
