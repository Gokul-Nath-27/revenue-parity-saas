import ProductContent from "@/features/products/components/product-content";
import { AddProductDialog } from "@/features/products/components/product-dialog";

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage your digital products</p>
        </div>
        <AddProductDialog />
      </div>
      {/* <Suspense fallback={<ProductSkeleton />}> */}
      <ProductContent />
      {/* </Suspense> */}
    </div>
  );
}