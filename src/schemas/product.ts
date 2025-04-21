import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(10),
  description: z.string(),
  price: z.coerce.number().min(10),
});