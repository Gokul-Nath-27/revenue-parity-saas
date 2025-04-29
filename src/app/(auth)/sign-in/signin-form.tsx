"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "@/features/account/actions"

import OAuth from "../OAuth"

export default function SignInForm() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("oauthError")
  const notAuthorized = searchParams.get("not-authorized")
  const [state, action, pending] = useActionState(signIn, {});

  useEffect(() => {
    if (state?.message && !pending) {
      toast.error(state.message);
    }
  }, [state, pending]);

  useEffect(() => {
    if (notAuthorized) {
      toast.error("You are not authorized to access this page");
    }
  }, [notAuthorized]);

  return (
    <form action={action} className="space-y-4" autoComplete="off">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium leading-none">
          Email
        </label>
        <Input
          name="email"
          id="email"
          placeholder="m@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium leading-none">
            Password
          </label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input name="password" id="password" type="password" autoComplete="off" />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        Sign in
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
        {`Don't have an account? `}
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  )
} 