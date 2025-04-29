import { getProducts } from '../db';

import { ProductGrid } from './product-grid';
import { ProductsEmpty } from './products-empty';
export default async function ProductContent() {
  const products = await getProducts();
  if (products.length === 0) {
    return <ProductsEmpty />
  }
  return (
    <ProductGrid products={products} />
  )
}