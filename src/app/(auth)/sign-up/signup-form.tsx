"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signup } from "@/features/account/actions"

import OAuth from "../OAuth"

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, {})
  const searchParams = useSearchParams()
  const oauthError = searchParams.get("oauthError")

  useEffect(() => {
    if (state?.message && !pending) {
      toast.error(state.message);
    }
  }, [state, pending]);

  return (
    <form action={action} autoComplete="off" className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Name
        </label>
        <Input id="name" placeholder="John" name="name" />
      </div>
      <div>
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
          required
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Password
        </label>
        <Input id="password" type="password" name="password" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        Create account
        {pending ? <div
          role="status"
          aria-label="Loading"
          className="spinner-dark-mode size-4 shrink-0 rounded-full"
        /> : <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
      {/* Third Party Authentication */}
      <OAuth />
      {oauthError && <p className="text-sm text-destructive text-center">{oauthError}</p>}
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  )
} 