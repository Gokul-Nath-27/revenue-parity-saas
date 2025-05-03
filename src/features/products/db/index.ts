import { and, count, eq } from "drizzle-orm";

import db from "@/drizzle/db";
import { Product, ProductCustomization } from "@/drizzle/schemas";
import { catchError } from "@/lib/utils";
import { withAuthUserId } from "@/lib/with-auth";
import { canCreateProduct } from "@/permissions";

export const getProducts = withAuthUserId(
  // callback function
  async function (userId) {
    const products = await db.query.Product.findMany({
      where: eq(Product.user_id, userId),
      columns: {
        id: true,
        name: true,
        description: true,
        domain: true,
        updated_at: true,
      }
    });
    return products;
  }
);

export const createProduct = withAuthUserId(
  // callback function
  async function (userId, data: typeof Product.$inferInsert) {
    const { error, data: hasPermission } = await catchError(canCreateProduct())
    if (error || !hasPermission) return { error: "You have reached the limit of products for your plan." }

    const [newProduct] = await db
      .insert(Product).values({
        ...data,
        user_id: userId
    }).returning({
      id: Product.id,
      user_id: Product.user_id,
    });

  try {
    await db
      .insert(ProductCustomization)
      .values({
        product_id: newProduct.id,
      })
      .onConflictDoNothing({
        target: ProductCustomization.product_id,
      })
  } catch (e) {
    await db.delete(Product).where(eq(Product.id, newProduct.id))
  }
  return newProduct;
});

export const getProductDetails = withAuthUserId(
  // callback function
  async function (userId, productId: string) {
    const product = await db.query.Product.findFirst({
      where: and(eq(Product.id, productId), eq(Product.user_id, userId)),
      columns: {
        id: true,
        name: true,
        description: true,
        domain: true,
      },
    });
    return product;
  }
);

export const updateProduct = withAuthUserId(
  // callback function with the userId by default
  async function (userId, productId: string, data: typeof Product.$inferInsert) {
    const { rowCount } = await db
      .update(Product)
      .set(data)
      .where(and(eq(Product.id, productId), eq(Product.user_id, userId)));
    return rowCount > 0;
  }
);


export const deleteProduct = withAuthUserId(
  // callback function
  async function (userId, productId: string) {
    const { rowCount } = await db
      .delete(Product)
      .where(and(eq(Product.id, productId), eq(Product.user_id, userId)));
    return rowCount > 0;
  }
);

export const getProductCount = async function (userId: string) {
  const counts = await db
    .select({ productCount: count() })
    .from(Product)
    .where(eq(Product.user_id, userId))
  return counts[0].productCount
}
