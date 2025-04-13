'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { signInAction } from "@/server-actions/auth"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import OAuth from "../_components/OAuth"

export default function SignInPage() {
  const [error, actionFn, isPending] = useActionState(signInAction, null)

  useEffect(() => {
    if (error instanceof Error) {
      console.error("Sign In Error:", error.message)
      toast.error(error.message)
    }
  }, [error])

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
      </div>
      <form action={actionFn} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <Input
            name="email"
            id="email"
            placeholder="m@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            {/* <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link> */}
          </div>
          <Input name="password" id="password" type="password" />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Sign in
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {/* Third Party Authenticatoin */}
        <OAuth />
      </form>
    </div>
  )
}



