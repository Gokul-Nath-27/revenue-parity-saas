import ForgotPasswordForm from "@/features/account/componets/forget-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Forgot password</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your email address and we&apos;ll send you a link to reset your password
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  )
}
