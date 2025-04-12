const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 p-6 md:p-10 mt-[65px]">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
