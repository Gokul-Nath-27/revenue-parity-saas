'use client'
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
import { useActionState } from "react"
import { } from "@/server-actions/auth"

export default function SignInForm() {



  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign In to your account</CardTitle>
          <CardDescription>Enter your email below to Sign In to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>

                  </div>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </div>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link className="underline underline-offset-4" href="/sign-up">
                  <Button variant="link" className="p-0 underline">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}