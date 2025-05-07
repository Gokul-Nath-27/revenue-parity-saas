import { Metadata } from "next";
import { Suspense } from "react"

import AuthFormSkeleton from "@/components/AuthFormSkeleton"
import SignInForm from "@/features/account/componets/signin-form"

export const metadata: Metadata = {
  title: "Sign In - RevenueParity",
  description: "Sign in to your account to continue",
};

export default async function SignInPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
      <Suspense fallback={<AuthFormSkeleton />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}