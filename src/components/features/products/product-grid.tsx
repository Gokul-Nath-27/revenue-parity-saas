"use cache"
import React from 'react';
import { ProductActions } from './action-dropdown';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type ProductMainContentProps = {
  products: Product[];
};

export const ProductMainContent: React.FC<ProductMainContentProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative bg-gradient-to-b from-card to-background border border-border rounded-2xl p-4 w-full max-w-sm transition-all duration-200 hover:scale-[1.002] hover:shadow-lg hover:border-primary/20 cursor-pointer"
        >
          <div className="space-y-4">
            <div className='flex justify-between'>
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
              <ProductActions />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-primary">
                ${product.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};