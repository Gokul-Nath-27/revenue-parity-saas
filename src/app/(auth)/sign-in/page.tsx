'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { signIn } from "@/server/actions/auth"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import OAuth from "../_components/OAuth"

export default function SignInPage() {
  const [state, action, pending] = useActionState(signIn, {});

  useEffect(() => {
    if (state?.message && !pending) {
      toast.error(state.message);
    }
  }, [state, pending]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
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

        <div className="mt-4 text-center text-sm">
          {`Don't have an account? `}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}