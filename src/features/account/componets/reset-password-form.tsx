"use client"

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/features/account/actions";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [state, formAction, pending] = useActionState(resetPassword, {});

  useEffect(() => {
    if (state?.message && !pending) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        router.push("/sign-in");
      }
    }
  }, [state, pending, router]);

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Invalid Token</h1>
        <p className="text-gray-500 dark:text-gray-400">The password reset token is missing or invalid.</p>
        <Link href="/forgot-password" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          New Password
        </label>
        <Input id="password" type="password" name="password" required minLength={8} />
        {state?.errors?.password && <p className="text-red-500 text-sm">{state.errors.password.join(", ")}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm New Password
        </label>
        <Input id="confirmPassword" type="password" name="confirmPassword" required minLength={8} />
        {state?.errors?.confirmPassword && (
          <p className="text-red-500 text-sm">{state.errors.confirmPassword.join(", ")}</p>
        )}
      </div>
      <SubmitButton text="Reset password" loadingText="Resetting..." />
      <div className="text-center">
        <Link href="/sign-in" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}
