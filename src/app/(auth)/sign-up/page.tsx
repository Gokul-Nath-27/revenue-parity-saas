"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { signup } from "@/server/actions/auth"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import OAuth from "../OAuth"

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, {})

  useEffect(() => {
    if (state?.message && !pending) {
      toast.error(state.message);
    }
  }, [state, pending]);

  // TODO: Need to add error

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your information to get started</p>
          </div>
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
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

