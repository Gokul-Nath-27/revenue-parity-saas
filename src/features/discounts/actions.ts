"use server"
import { revalidatePath } from "next/cache";

import { CountryGroupDiscount } from "@/drizzle/schemas";

import { updateCountryDiscounts as updateCountryDiscountsIntoDb } from './db';
import { productCountryDiscountsSchema } from "./schema";

type ActionState = {
  error: boolean;
  message: string;
  errorFields: Record<string, Record<string, string[]>>;
  formData?: Record<string, string>;
};

export async function updateCountryDiscounts(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const groupIndexes = new Set<string>();

  // Extract group indexes from the formData keys
  for (const [key] of formData.entries()) {
    const match = key.match(/^groups\[(.+?)\]/);
    if (match) {
      groupIndexes.add(match[1]);
    }
  }

  // Build the groups data from the formData
  const groups = Array.from(groupIndexes).map(index => {
    const countryGroupId = formData.get(`groups[${index}][countryGroupId]`) as string;
    const discountStr = formData.get(`groups[${index}][discountPercentage]`) as string;
    const coupon = formData.get(`groups[${index}][coupon]`) as string;

    // Coerce discount to number and handle empty fields
    const discountPercentage = discountStr?.trim() !== ""
      ? Number(discountStr)
      : undefined;

    return {
      countryGroupId,
      discountPercentage,
      coupon,
    };
  });

  console.log(11, groups);

  // Validate the groups data using the schema
  const parsed = productCountryDiscountsSchema.safeParse({ groups });

  if (!parsed.success) {
    const errorFields: Record<string, Record<string, string[]>> = {};
    parsed.error.issues.forEach(issue => {
      console.log(44444, issue);
      if (issue.path[0] === 'groups' && typeof issue.path[1] === 'number') {
        const groupIndex = issue.path[1];
        const groupId = groups[groupIndex].countryGroupId;
        if (!errorFields[groupId]) {
          errorFields[groupId] = {};
        }
        // Handle group-level errors (path length 2) or field-level errors (path length 3)
        const field = issue.path.length === 3 ? issue.path[2] : 'group';
        if (!errorFields[groupId][field]) {
          errorFields[groupId][field] = [];
        }
        errorFields[groupId][field].push(issue.message);
      }
    });
    console.log(33333, errorFields);

    // Convert FormData to a plain object for the client
    const formDataObject: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value as string;
    }


    return {
      error: true,
      message: "Invalid data",
      errorFields,
      formData: formDataObject,
    };
  }

  const productId = formData.get("productId") as string;
  const insert: (typeof CountryGroupDiscount.$inferInsert)[] = [];
  const deleteIds: { country_group_id: string }[] = [];

  // Build insert and delete data based on validated groups
  parsed.data.groups.forEach(group => {
    if (
      group.coupon &&
      group.coupon.length > 0 &&
      typeof group.discountPercentage === "number" &&
      group.discountPercentage > 0
    ) {
      insert.push({
        country_group_id: group.countryGroupId,
        product_id: productId,
        coupon: group.coupon,
        discount_percentage: group.discountPercentage / 100,
      });
    } else {
      deleteIds.push({ country_group_id: group.countryGroupId });
    }
  });

  console.log(22, insert, deleteIds);

  // Update the database with insert and delete data
  await updateCountryDiscountsIntoDb(deleteIds, insert, { productId });

  revalidatePath(`/dashboard/products/${productId}/?tab=discounts`);

  return { error: false, message: "Country discounts saved", errorFields: {}, formData: {} };
}