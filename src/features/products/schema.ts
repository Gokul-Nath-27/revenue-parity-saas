import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().nullable(),
  domain: z.string().url(),
});

export type ProductForm = z.infer<typeof productFormSchema>;
export type Product = ProductForm & {
  id: string;
  updated_at: Date;
};