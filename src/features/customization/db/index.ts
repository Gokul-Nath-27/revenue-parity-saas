import { eq } from "drizzle-orm";

import db from "@/drizzle/db";
import { ProductCustomization } from "@/drizzle/schemas";
import { withAuthUserId } from "@/lib/with-auth";

export const getProductCustomization = withAuthUserId(
  async function (userId, productId: string) {
    const product = await db.query.Product.findFirst({
      where: ({ id, user_id }, { and, eq }) =>
        and(eq(id, productId), eq(user_id, userId)),
      with: {
        product_customization: {
          columns: {
            id: true,
            product_id: true,
            location_message: true,
            background_color: true,
            text_color: true,
            banner_container: true,
            sticky: true,
            font_size: true,
            banner_radius: true,
            class_prefix: true,
          }
        },
      },
    })
    return {
      userId,
      customization: product?.product_customization,
    }
  }
);

export const updateBannerCustomizationIntoDb = async (data: typeof ProductCustomization.$inferInsert) => {
  const { rowCount } = await db
    .update(ProductCustomization)
    .set(data)
    .where(eq(ProductCustomization.product_id, data.product_id));
  return rowCount > 0;
}