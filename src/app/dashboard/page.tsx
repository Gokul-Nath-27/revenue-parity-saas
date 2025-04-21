import { AddProductDialog } from "@/components/features/products/product-dialog";
import { ProductMainContent } from "@/components/features/products/product-grid";
import { ProductSkeleton } from "@/components/features/products/product-skeleton";
import { ProductsEmpty } from "@/components/features/products/products-empty";
import { getCurrentUser } from "@/server/actions/session";
import { Suspense } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

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
      <Suspense fallback={<ProductSkeleton />}>
        <DynamicContent />
      </Suspense>
    </div>
  );
}

const DynamicContent = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  const products: Product[] = [{
    id: "112",
    name: "adwa",
    description: "adwad",
    price: 1,
  }];
  return (
    <>{products.length === 0 ? <ProductsEmpty /> : <ProductMainContent products={products} />}</>
  )
}