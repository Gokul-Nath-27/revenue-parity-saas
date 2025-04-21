import ProductsPanel from "@/components/features/products/products-pannel";
import { getCurrentUser } from "@/server/actions/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/sign-in')

  return (
    <div className="flex h-full w-full flex-col">
      <ProductsPanel />
    </div>
  );
}