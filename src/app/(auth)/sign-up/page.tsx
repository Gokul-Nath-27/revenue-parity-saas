import { Suspense } from "react"

import AuthFormSkeleton from "@/components/AuthFormSkeleton"

import SignupForm from "./signup-form"

export default async function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your information to get started</p>
          </div>
          <Suspense fallback={<AuthFormSkeleton />}>
            <SignupForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

