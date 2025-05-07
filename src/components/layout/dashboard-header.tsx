export default function DashboardHeader({
  title = "Dashboard",
  description = "Manage your digital products",
  children = null,
  rightContent = null
}: {
  title: string,
  description: string,
  children?: React.ReactElement | null,
  rightContent?: React.ReactElement | null
}) {
  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {rightContent}
      </div>
      {children}
    </div>
  )
}