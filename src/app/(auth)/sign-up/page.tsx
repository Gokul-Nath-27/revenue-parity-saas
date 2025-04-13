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
import { ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import OAuth from "../_components/OAuth"

// export default function SignUpPage() {
//   const [error, formAction, isPending] = useActionState(signupAction, null)

//   useEffect(() => {
//     if (error instanceof Error) {
//       toast.error(error.message)
//     }
//   }, [error])


//   return (
//     <Card>
//       <CardHeader className="text-center">
//         <CardTitle className="text-xl">Create an account</CardTitle>
//         <CardDescription>Enter your email below to create your account</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form action={formAction} autoComplete="off">
//           <div className="grid gap-6">
//             <div className="grid gap-6">
//               <div className="grid gap-3">
//                 <Label htmlFor="name">Name</Label>
//                 <Input id="name" name="name" type="text" placeholder="John Doe" />
//               </div>
//               <div className="grid gap-3">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="m@example.com"
//                 />
//               </div>
//               <div className="grid gap-3">
//                 <Label htmlFor="password">Password</Label>
//                 <Input id="password" name="password" type="password" />
//               </div>
//               <Button type="submit" className="w-full" disabled={isPending}>
//                 Sign up
//               </Button>
//             </div>
//             <div className="text-center text-sm cursor-pointer">
//               Already have an account?{" "}
//               <Link className="underline underline-offset-4" href="/sign-in">
//                 <Button variant="link" className="p-0 underline">
//                   Sign in
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your information to get started</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="first-name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                First name
              </label>
              <Input id="first-name" placeholder="John" />
            </div>
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
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Third Party Authentication */}
            <OAuth />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

