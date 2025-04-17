'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductActions } from './product-action-dropdown';
import ProductCreationModal from './product-create-modal';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const ProductsPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage your digital products</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="border border-dashed border-muted-foreground/50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-center mb-4">
              You haven't added any products yet.
              Add your first product to start selling globally.
            </p>
            <Button onClick={() => setOpen(true)} variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" /> Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
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
      )}
      <ProductCreationModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default ProductsPanel;
