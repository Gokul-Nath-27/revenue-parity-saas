"use server"
import { productSchema } from "@/schemas/product";
import { z } from "zod";

type Response = {
  success: boolean;
  errors: z.ZodError["flatten"] | null;
};

export async function createProductAction(prev: Response | null, formData: FormData): Promise<Response> {
  const rawData = Object.fromEntries(formData.entries());

  const { data, success, error } = productSchema.safeParse(rawData);
  console.log(data)

  if (!success) {
    console.log(error.flatten().formErrors)
    return {
      success: false,
      errors: error.flatten(),
    }
  }

  return { success: true, errors: null };
} 