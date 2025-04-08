export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div>
        <h3 className="text-md font-bold text-primary pb-2 text-center">
          Sample User account
        </h3>
        <div className="flex gap-3 text-sm justify-center">
          <div className="flex gap-2 font-bold">
            <p className="font-bold flex flex-col gap-2">
              <span className="text-primary text-start">
                Email:{" "}
                <span className="text-muted-foreground">test@test.com</span>
              </span>
            </p>
            <p className="font-bold flex flex-col gap-2">
              <span className="text-primary text-start">
                Password:{" "}
                <span className="text-muted-foreground">test123</span>
              </span>
            </p>
          </div>
        </div>
      </div>
      {children}
    </>
  )
}