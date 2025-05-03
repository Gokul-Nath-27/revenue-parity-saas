import { AvatarFallback , Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSessionIdFromCookie, getUser } from "@/lib/session";
import { generateIntials } from "@/lib/utils";

export default async function UserInformation() {
  const sessionId = await getSessionIdFromCookie();
  const user = await getUser(sessionId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="space-y-4 w-full">
          <div className="flex justify-between gap-2 items-center">
            <div>
              <p className="text-sm font-semibold">Name</p>
              <p className="text-muted-foreground">{user?.name}</p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="rounded-lg">{generateIntials(user?.name)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const UserInformationSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 w-full">
        <div className="flex justify-between gap-2 items-center">
          <div>
            <Skeleton className="h-4 w-24 mb-1" /> {/* Name label */}
            <Skeleton className="h-5 w-40" />       {/* Name value */}
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" /> {/* Avatar */}
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-1" /> {/* Email label */}
          <Skeleton className="h-5 w-40" />       {/* Email value */}
        </div>
      </CardContent>
    </Card>
  )
}
