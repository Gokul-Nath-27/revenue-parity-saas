import ProductContent from "@/components/features/products/product-content";
import { AddProductDialog } from "@/components/features/products/product-dialog";
import { ProductSkeleton } from "@/components/features/products/product-skeleton";
import { Suspense } from "react";

export default async function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage your digital products</p>
        </div>
        <AddProductDialog />
      </div>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent />
      </Suspense>
    </div>
  );
}