"use server"
import { Product } from "@/drizzle/schemas";
import { createProductIntoDb } from "@/features/products/db";
import { productFormSchema, ProductForm } from "@/features/products/schema";

type Response = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
  inputs?: ProductForm;
};

export async function createProduct(prev: Response, formData: FormData) {

  const rawData = Object.fromEntries(formData.entries()) as ProductForm;

  const { data, success, error } = productFormSchema.safeParse(rawData);

  if (!success) {
    return {
      success: false,
      message: "Invalid form data",
      errors: error.flatten().fieldErrors,
      inputs: rawData,
    }
  }
  const [product] = await createProductIntoDb(data as typeof Product.$inferInsert);
  if (!product) {
    return {
      success: false,
      message: "Failed to create product",
      inputs: rawData,
    }
  }
  return {
    success: true,
    message: "Product created successfully",
  }
} 

