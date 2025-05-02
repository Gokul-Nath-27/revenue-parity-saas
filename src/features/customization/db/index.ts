import db from "@/drizzle/db";
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