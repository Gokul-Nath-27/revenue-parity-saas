"use server"
import { redirect } from "next/navigation";

import { Product } from "@/drizzle/schemas";
import {
  createProduct as createProductIntoDb,
  deleteProduct as deleteProductFromDb,
  updateProduct as updateProductIntoDb
} from "@/features/products/db";
import { productFormSchema, ProductForm } from "@/features/products/schema";
import { catchError } from "@/lib/utils";

type ProductFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
  inputs?: ProductForm;
} | undefined;

export type UpdateFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
  inputs?: ProductForm;
} | undefined;

export async function createProduct(
  prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {

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
  const product = await createProductIntoDb(data as typeof Product.$inferInsert);
  if ("error" in product) {
    return {
      success: false,
      message: "Failed to create product",
      inputs: rawData,
    }
  }
  redirect(`/dashboard/products/${product.id}?tab=banner`);
} 

export async function updateProductDetails(
  prev: UpdateFormState,
  formData: FormData
): Promise<UpdateFormState> {
  const productId = formData.get("productId") as string;

  const rawData = Object.fromEntries(formData.entries());
  const { data, success, error } = productFormSchema.safeParse(rawData);

  if (!success) {
    return {
      success: false,
      message: "Invalid form data",
      errors: error.flatten().fieldErrors,
      inputs: rawData as ProductForm,
    }
  }
  const { error: dbError } = await catchError(
    updateProductIntoDb(productId, data as typeof Product.$inferInsert)
  );

  if (dbError) {
    return {
      success: false,
      message: "Failed to update product",
    }
  }
  return { success: true, message: "Product updated successfully" };
}


export async function deleteProduct(productId: string) {
  const { error } = await catchError(deleteProductFromDb(productId));
  if (error) {
    return {
      success: false,
      message: "Failed to delete product",
    }
  }
  return { success: true, message: "Product deleted successfully" };
}