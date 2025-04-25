"use client"

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { AddProductDialog } from './product-dialog';

export const ProductsEmpty = () => {
  return (
    <Card className="border border-dashed border-muted-foreground/50">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground text-center mb-4">
          You haven&apos;t added any products yet.
          Add your first product to start selling globally.
        </p>
        <AddProductDialog />
      </CardContent>
    </Card>
  );
}; 