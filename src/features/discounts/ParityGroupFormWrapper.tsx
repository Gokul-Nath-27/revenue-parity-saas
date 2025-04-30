import { Suspense } from "react";

import { getCountryGroupDiscounts } from "./db";
import ParityGroupForm from "./parity-group-form";

export type CountryGroup = {
  id: string;
  name: string;
  recommendedDiscountPercentage: number | null;
  countries: {
    code: string;
    name: string;
  }[];
  discount: {
    coupon: string;
    discount_percentage: number;
  } | undefined;
}[]


export default async function ParityGroupFormWrapper({ productId }: { productId: string }) {
  const countryGroups = await getCountryGroupDiscounts(productId);
  console.log(11, countryGroups);

  return <Suspense fallback={<div>Loading...</div>}>
    <ParityGroupForm
      productId={productId}
      countryGroups={countryGroups}
    />
  </Suspense>;
} 