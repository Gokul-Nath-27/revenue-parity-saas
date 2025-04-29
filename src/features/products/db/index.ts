import { eq } from "drizzle-orm";

import db from "@/drizzle/db";
import { Product, ProductCustomization } from "@/drizzle/schemas";
import { withAuthUserId } from "@/lib/with-auth";

export const getProducts = withAuthUserId(async function getProducts(userId) {
  const products = await db.query.Product.findMany({
    where: eq(Product.user_id, userId),
    columns: {
      id: true,
      name: true,
      description: true,
      domain: true
    }
  });
  return products;
});

export const createProductIntoDb = withAuthUserId(async function insertProduct(userId, data: typeof Product.$inferInsert) {
  const product = await db.insert(Product).values({
    ...data,
    user_id: userId
  }).returning({
    id: Product.id,
    name: Product.name,
    description: Product.description,
    domain: Product.domain,
  });
  await db.insert(ProductCustomization).values({
    product_id: product[0].id,
  });
  return product;
});