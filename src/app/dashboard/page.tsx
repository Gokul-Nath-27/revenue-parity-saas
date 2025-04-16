import { getCurrentUser } from "@/server-actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/sign-in')

  return (
    <main className="px-4 md:px-6 md:py-4 md:min-h-screen">
      <h1 className="text-2xl">
        Welcome back, {currentUser.name}!
        <br />
        Your role is: {currentUser.role}
      </h1>
    </main>
  );
}