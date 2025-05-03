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
  const [state, createAction, pending] = useActionState(createProduct, undefined);

  useEffect(() => {
    if (!pending && state?.message) {
      if (state.success) {
        setOpen(false);
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, pending]);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 cursor-pointer">
        <Plus className="h-4 w-4" /> Add Product
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
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
              <Input id="name" placeholder="Product Name" name="name" required minLength={3} defaultValue={state?.inputs?.name || ""} />
              {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name.join(", ")}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="description">Description</label>
              <Textarea
                name="description"
                className="resize-none h-20"
                placeholder="Describe your product"
                id="description"
                defaultValue={state?.inputs?.description || ""}
              />
              {state?.errors?.description && <p className="text-red-500 text-sm">{state.errors.description.join(", ")}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="domain">Domain</label>
              <Input
                type="text"
                id="domain"
                required
                placeholder="example.com"
                defaultValue={state?.inputs?.domain || ""}
                name="domain"
              />
              {state?.errors?.domain && <p className="text-red-500 text-sm">{state.errors.domain.join(", ")}</p>}
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