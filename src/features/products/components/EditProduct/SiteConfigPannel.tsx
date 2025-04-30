import { Card, CardContent } from '@/components/ui/card';
import { getProductDetails } from '@/features/products/db';
import { catchError } from '@/lib/utils';

import { EditProductForm } from './EditProductForm';
import ProductNotFound from './ProductNotFound';

export default async function SiteConfigPanel({ productId }: { productId: string }) {
  const { data: product, error } = await catchError(getProductDetails(productId));

  if (error) return <ProductNotFound />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
        <CardContent className="relative z-10">
          {product && <EditProductForm product={product} />}
        </CardContent>
      </Card>
    </div>
  );
}