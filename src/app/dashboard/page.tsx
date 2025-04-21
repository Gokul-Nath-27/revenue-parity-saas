import { ProductMainContent } from "@/components/features/products/product-grid";
import { ProductsEmpty } from "@/components/features/products/products-empty";
import { getCurrentUser } from "@/server/actions/session";
import { redirect } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export default function DashboardPage() {
  const products: Product[] = [];

  return (
    <div className="flex h-full w-full flex-col">
      {products.length === 0 ? (
        <ProductsEmpty />
      ) : (
        <ProductMainContent products={products} />
      )}
    </div>
  );
}