"use server"
import { productSchema } from "@/schemas/product";

type Response = {
  success: boolean;
  errors: any;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function createProductAction(prev: Response | null, formData: FormData) {

  await delay(2000);

  const rawData = Object.fromEntries(formData.entries());

  const { data, success, error  } = productSchema.safeParse(rawData);

  if (!success) {
    console.log(error.flatten().formErrors)
    return {
      success: false,
      errors: error.flatten().fieldErrors,
    }
  }

  return { success: true, errors: null };
} 