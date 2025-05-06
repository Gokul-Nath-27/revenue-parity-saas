import { getCountryGroupDiscounts } from "../db";

import ParityGroupForm from "./parity-group-form";

export type CountryGroups = {
  id: string;
  name: string;
  recommendedDiscount: number | null;
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

  return (
    <ParityGroupForm
      productId={productId}
      countryGroups={countryGroups}
    />
  )
} 