import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(10),
  description: z.string(),
  domain: z.string().url(),
});

export type Product = z.infer<typeof productSchema>;