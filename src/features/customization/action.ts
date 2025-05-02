"use server";

import { getProductDetails } from "@/features/products/db";
import { withAuthUserId } from "@/lib/with-auth";
import { canCustomizeBanner } from "@/permissions";

import { updateBannerCustomizationIntoDb } from "./db";
import { productCustomizationSchema } from "./schema";

export async function updateBannerCustomization(
  formData: FormData
) {
  const productId = formData.get("productId") as string;
  const rawData = Object.fromEntries(formData.entries())
  const { success, data } = productCustomizationSchema.safeParse(rawData)
  console.log(success, data)

  if (!success || !canCustomize()) {
    return {
      error: true,
      message: "There was an error updating your banner",
    }
  }

  const product = await getProductDetails(productId)
  if (product == null) return { error: true, message: "Product not found" }

  const result = await updateBannerCustomizationIntoDb({
    ...data,
    product_id: product.id,
  })

  if (!result) return { error: true, message: "There was an error updating your banner" }

  return { error: false, message: "Banner updated" }
}

const canCustomize = withAuthUserId(async (userId) => {
  return await canCustomizeBanner(userId)
})
