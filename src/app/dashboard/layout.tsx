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
import { Suspense } from "react"
import UserProfileDropdown from "@/components/common/user-profile-dropdown"
import { getCurrentUser } from "@/server/actions/session"

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
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-10 bg-background/70 backdrop-blur-md">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <Suspense fallback={<Skeleton className="h-8 w-8 rounded-lg bg-muted/50 mr-4" />}>
            <ProfileWrapper />
          </Suspense>
        </header>

        {/* Desktop/Mobile Main Content */}
        <main className="px-4 py-3">
          <Suspense fallback={<DashboardSkeleton />}>
            {children}
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
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

const TriggerButton = ({ currentUser }: { currentUser: { name: string; email: string } }) => {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={"dawd"} alt={currentUser.name} />
      <AvatarFallback className="rounded-lg">{generateIntials(currentUser.name)}</AvatarFallback>
    </Avatar>
  );
};

const ProfileWrapper = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  return (
    <UserProfileDropdown
      currentUser={currentUser}
      trigger={<TriggerButton currentUser={currentUser} />}
      isMobile={true}
    />
  );
};