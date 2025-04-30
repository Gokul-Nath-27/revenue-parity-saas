import { eq } from "drizzle-orm";

import db from "@/drizzle/db";
import { ProductCustomization } from "@/drizzle/schemas/customization";

export const getCustomization = async (productId: string) => {
  return await db.query.ProductCustomization.findFirst({
    where: eq(ProductCustomization.product_id, productId),
  });
};  