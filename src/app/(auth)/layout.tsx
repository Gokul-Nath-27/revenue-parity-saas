import Navbar from "../../components/layout/Navbar"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-dvh flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Navbar />
      <div className="flex w-full h-full max-w-sm flex-col gap-6 justify-center">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
