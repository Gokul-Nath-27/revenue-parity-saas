"use client"

import { Plus } from 'lucide-react';
import React, { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createProduct } from '@/features/products/actions';


export const AddProductDialog = () => {
  const [open, setOpen] = useState(false);
  const [state, createAction, pending] = useActionState(createProduct, null);

  useEffect(() => {
    if (state?.success) {
      toast.success('Product created successfully');
      setOpen(false);
    } else if (state?.errors && !pending && !state.success) {
      // Object.values(state.errors).forEach((value) => {
      //   toast.error(value);
      // });
    }
  }, [state, pending]);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 cursor-pointer">
        <Plus className="h-4 w-4" /> Add Product
      </Button>
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogContent className="sm:max-w-[425px] [&>button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>{"Add New Product"}</DialogTitle>
            <DialogDescription>
              {"Fill in the details to add a new product."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" action={createAction}>
            <div>
              <label className="block text-sm font-medium" htmlFor="name">Product Name</label>
              <Input id="name" placeholder="Premium E-book" name="name" required />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="description">Description</label>
              <Textarea
                name="description"
                className="resize-none h-20"
                placeholder="Describe your product"
                id="description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium" htmlFor="price">Price</label>
                <Input
                  type="number"
                  id="price"
                  required
                  placeholder="29.99"
                  min="0"
                  step="0.01"
                  name="price"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {"Add Product"}
                {pending && <div
                  role="status"
                  aria-label="Loading"
                  className="spinner-dark-mode ml-auto size-4 shrink-0 rounded-full"
                />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}; 