import { Plus } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

import DashboardHeader from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { HasPermission } from "@/features/products/components/has-permission";
import ProductContent from "@/features/products/components/product-content";
import { AddProductDialog } from "@/features/products/components/product-dialog";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";


export const metadata: Metadata = {
  title: "Dashboard - RevenueParity",
  description: "Manage your digital products",
};

export default async function DashboardPage() {
  return (
    <DashboardHeader
      title="Products"
      description="Manage your digital products"
      rightContent={<AddProductButton />}
    >
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent />
      </Suspense>
    </DashboardHeader>
  );
}


const AddProductButton = () => {
  return (
    <Suspense fallback={<Skeleton className="w-32 h-10" />}>
      <HasPermission
        fallback={
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-not-allowed">
                <Button disabled>
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>You have reached the limit of products for your plan.</p>
            </TooltipContent>
          </Tooltip>
        }
      >
        <AddProductDialog />
      </HasPermission>
    </Suspense>
  )
}