import { z } from "zod"

export const productCountryDiscountsSchema = z.object({
  groups: z.array(
    z
      .object({
        countryGroupId: z.string().min(1, "Required"),
        discountPercentage: z
          .coerce
          .number()
          .max(100)
          .min(1)
          .or(z.nan())
          .transform(n => (isNaN(n) ? undefined : n))
          .optional(),
        coupon: z.string().optional(),
      })
      .refine(
        value => {
          const hasCoupon = value.coupon != null && value.coupon.length > 0
          const hasDiscount = value.discountPercentage != null
          return !(hasCoupon && !hasDiscount)
        },
        {
          message: "A discount is required if a coupon code is provided",
        }
      )
  ),
})
