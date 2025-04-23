import { getUser } from "@/server/lib/user";
import { ProductsEmpty } from "./products-empty";
import { ProductMainContent } from "./product-grid";
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const ProductContent = async () => {
  const user = await getUser();
  if (!user) return null;

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

export default ProductContent