import { ProductMainContent } from './product-grid';
import { ProductsEmpty } from './products-empty';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export default function ProductContent() {
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