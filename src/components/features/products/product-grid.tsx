import React from 'react';
import { ProductActions } from './product-action-dropdown';

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
        <div key={product.id} className="relative group bg-gradient-to-b from-[#1C1C1F] to-[#141416] border border-zinc-800/50 rounded-2xl p-6 w-full max-w-sm transition hover:shadow-lg hover:-translate-y-1 hover:border-zinc-700">
          <div className="flex justify-end h-24 w-full mb-6">
            <ProductActions />
          </div>
          <div className="text-lg font-semibold text-white mb-2">
            {product.name}
          </div>
          <p className="text-sm text-zinc-400 leading-snug">
            {product.description}
          </p>
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}; 