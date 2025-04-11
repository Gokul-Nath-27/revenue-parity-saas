"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { signupAction } from "@/server-actions/auth"
import { toast } from "sonner"

export default function SignUpPage() {
  const [error, formAction, isPending] = useActionState(signupAction, null)

  useEffect(() => {
    if (error instanceof Error) {
      toast.error(error.message)
    }
  }, [error])


  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} autoComplete="off">
          <input type="hidden" name="previousState" value={JSON.stringify({})} />
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                Sign up
              </Button>
            </div>
            <div className="text-center text-sm cursor-pointer">
              Already have an account?{" "}
              <Link className="underline underline-offset-4" href="/sign-in">
                <Button variant="link" className="p-0 underline">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
