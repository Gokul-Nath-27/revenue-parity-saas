import { AppSidebar } from "@/components/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { generateIntials } from "@/lib/utils"
import { getCurrentUser } from "@/server/actions/session"
import { Suspense } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <SidebarProvider>

      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <SidebarInset>
        <header className="md:hidden flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <Suspense>
            <Profile />
          </Suspense>
        </header>
        <main className="px-4 py-3">

          <Suspense fallback={<DashboardSkeleton />}>
            {children}
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

const Profile = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) return null

  return (
    <Avatar className="h-8 w-8 rounded-full mx-4">
      <AvatarImage src={""} alt={currentUser.name} />
      <AvatarFallback className="rounded-full">{generateIntials(currentUser.name)}</AvatarFallback>
    </Avatar>
  )
}
const DashboardSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Skeleton className="aspect-video rounded-xl bg-muted/50" />
        <Skeleton className="aspect-video rounded-xl bg-muted/50" />
        <Skeleton className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <Skeleton className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}