import { getCurrentUser } from "@/server-actions/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/sign-in')

  return (
    <h1 className="text-2xl">
      Welcome to your dashboard, {currentUser.id}!
      <br />
      Your role is: {currentUser.role}
    </h1>
  );
}