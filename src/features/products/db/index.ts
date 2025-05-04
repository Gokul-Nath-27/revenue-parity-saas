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


export const getProductViewCount = async function (userId: string, startDate: Date) {
  const counts = await db
  .select({ pricingViewCount: count() })
  .from(ProductView)
  .innerJoin(Product, eq(Product.id, ProductView.product_id))
  .where(
    and(
      eq(Product.user_id, userId),
      gte(ProductView.visited_at, startDate)
    )
  )

  return counts[0]?.pricingViewCount ?? 0
}

export async function createProductView({
  productId,
  countryId,
}: {
  productId: string
  countryId?: string
}) {
  const [newRow] = await db
    .insert(ProductView)
    .values({
      product_id: productId,
      visited_at: new Date(),
      country_id: countryId,
    })
    .returning({ id: ProductView.id })
  return newRow
}


export async function getProductForBanner({
  id,
  countryCode,
  url,
}: {
  id: string;
  countryCode: string;
  url: string;
  }) {
  console.log(222, id, countryCode, url)
  // Query product data with all necessary relations
  const data = await db.query.Product.findFirst({
    where: (Product, { eq, and }) => and(eq(Product.id, id), eq(Product.domain, url)),
    columns: {
      id: true,
      user_id: true,
    },
    with: {
      product_customization: true,
      country_group_discounts: {
        columns: {
          coupon: true,
          discount_percentage: true,
        },
        with: {
          country_group: {
            with: {
              countries: {
                columns: {
                  id: true,
                  name: true,
                },
                limit: 1,
                where: ({ code }, { eq }) => eq(code, countryCode),
              },
            },
          },
        },
      },
    },
  });
  console.log(3333, data)

  // Early return if no data found
  if (!data) {
    return { product: undefined, country: undefined, discount: undefined };
  }

  // Find applicable discount for the country
  const discount = data.country_group_discounts.find(
    discount => discount.country_group.countries.length > 0
  );
  
  // Format product data if available
  const product = data.product_customization 
    ? {
        id: data.id,
        user_id: data.user_id,
        customization: data.product_customization,
      }
    : undefined;

  // Get country info from the discount
  const country = discount?.country_group.countries[0];
  
  // Format discount data if available
  const formattedDiscount = discount
    ? {
        coupon: discount.coupon,
        percentage: discount.discount_percentage,
      }
    : undefined;

  return {
    product: product,  
    country: country,
    discount: formattedDiscount,
  };
}