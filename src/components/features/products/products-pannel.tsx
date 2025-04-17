'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Plus, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
};

const initialForm = {
  name: '',
  description: '',
  price: '',
  currency: 'USD',
};

const ProductsPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 2) {
      errors.name = "Product name must be at least 2 characters.";
    }
    if (!formData.description || formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = "Price must be a valid number.";
    }
    if (!formData.currency) {
      errors.currency = "Currency is required.";
    }
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (editingProduct) {
      // Edit mode
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
      // toast({ title: "Product updated", description: `${formData.name} updated successfully.` });
    } else {
      // Add mode
      setProducts([...products, { ...formData, id: Date.now().toString() }]);
      // toast({ title: "Product added", description: `${formData.name} added to your list.` });
    }

    setIsDialogOpen(false);
    setFormData(initialForm);
    setEditingProduct(null);
    setFormErrors({});
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    // toast({
    //   title: "Product deleted", description: "The product has been removed.", variant: "destructive"
    // });
  };

  const openNewProductDialog = () => {
    setFormData(initialForm);
    setEditingProduct(null);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage your digital products</p>
        </div>
        <Button onClick={openNewProductDialog} className="gap-2">
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
            <Button onClick={openNewProductDialog} variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" /> Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold">{product.currency} {product.price}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t p-4">
                <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(product.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update your product details below."
                : "Fill in the details to add a new product."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Premium E-book"
              />
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <Textarea
                className="resize-none h-20"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product..."
              />
              {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Price</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="29.99"
                  min="0"
                  step="0.01"
                />
                {formErrors.price && <p className="text-sm text-red-500">{formErrors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
                {formErrors.currency && <p className="text-sm text-red-500">{formErrors.currency}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPanel;
