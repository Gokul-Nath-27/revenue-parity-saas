"use client"
import React, { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import SubmitButton from '@/components/SubmitButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateProductDetails, type UpdateFormState } from '@/features/products/actions';
import { Product } from '@/features/products/schema';

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}

const FormField = ({ label, name, error, children }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);


export function EditProductForm({ product }: { product: Product }) {
  const [state, formAction] = useActionState<UpdateFormState, FormData>(
    updateProductDetails,
    undefined
  );

  const { name, description, domain } = product;
  const { name: inputedName, description: inputedDescription, domain: inputedDomain } = state?.inputs || {};

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
    } else if (state.errors) {
      toast.error(state.message);
    }
  }, [state]);


  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Site Information</h3>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="productId" value={product.id} />

        <FormField label="Site Name" name="name" error={state?.errors?.name?.[0]}>
          <Input
            id="name"
            name="name"
            placeholder="My Digital Product Store"
            defaultValue={inputedName || name || ""}
            required
          />
        </FormField>

        <FormField label="Site Description" name="description" error={state?.errors?.description?.[0]}>
          <Textarea
            id="description"
            name="description"
            placeholder="A brief description of your site and products..."
            className="resize-none h-32"
            defaultValue={inputedDescription || description || ""}
          />
        </FormField>

        <FormField label="Domain" name="domain" error={state?.errors?.domain?.[0]}>
          <div className="space-y-2">
            <Input
              id="domain"
              name="domain"
              placeholder="yourdomain.com"
              defaultValue={inputedDomain || domain || ""}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter your domain without http:// or https://
            </p>
          </div>
        </FormField>

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
} 