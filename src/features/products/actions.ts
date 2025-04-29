"use server"
import { productSchema } from "@/features/products/schema";

type Response = {
  success: boolean;
  errors: null
};

export async function createProduct(prev: Response | null, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  const { data, success, error } = productSchema.safeParse(rawData);
  console.log(data)

  if (!success) {
    console.log(error.flatten().formErrors)
    return {
      success: false,
      errors: null,
    }
  }

  return { success: true, errors: null };
} 