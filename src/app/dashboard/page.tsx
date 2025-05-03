import { Plus } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipTrigger , Tooltip , TooltipContent } from "@/components/ui/tooltip";
import { HasPermission } from "@/features/products/components/has-permission";
import ProductContent from "@/features/products/components/product-content";
import { AddProductDialog } from "@/features/products/components/product-dialog";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";

export default async function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage your digital products</p>
        </div>
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
      </div>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent />
      </Suspense>
    </div>
  );
}