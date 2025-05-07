import {
  getVisitorsByParityGroup,
  getVisitorsByCountry,
  getVisitorsByDay,
  getMostViewedProducts
} from "@/features/analytics/actions";
import { MostViewedProductsChart } from "@/features/analytics/components/charts/most-viewed-products-chart";

import { VisitorsByCountryChart } from "./charts/visitors-by-country-chart";
import { VisitorsByDayChart } from "./charts/visitors-by-day-chart";
import { VisitorsByParityGroupChart } from "./charts/visitors-by-parity-group-chart";


export async function VisitorsByParityGroupData() {
  const data = await getVisitorsByParityGroup();

  return <VisitorsByParityGroupChart data={data} />
}

export async function VisitorsByCountryData() {
  const data = await getVisitorsByCountry();

  return <VisitorsByCountryChart data={data} />
}

export async function VisitorsByDayData() {
  const data = await getVisitorsByDay();

  return <VisitorsByDayChart data={data} />
}

export async function MostViewedProductsData() {
  const data = await getMostViewedProducts();

  return <MostViewedProductsChart data={data} />
}