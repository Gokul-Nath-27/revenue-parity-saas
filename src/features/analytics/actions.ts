"use server";

import { count, eq, sql } from "drizzle-orm";

import db from "@/drizzle/db";
import { Country , CountryGroup } from "@/drizzle/schemas/country";
import { Product } from "@/drizzle/schemas/product";
import { ProductView } from "@/drizzle/schemas/visits";
import { withAuthUserId } from "@/lib/with-auth";

export interface VisitorsByParityGroupData {
  name: string;
  visitors: number;
}

export const getVisitorsByParityGroup = withAuthUserId(async (userId: string): Promise<VisitorsByParityGroupData[]> => {
  try {
    const result = await db
      .select({
        parityGroupName: CountryGroup.name,
        visitorCount: count(ProductView.id),
      })
      .from(ProductView)
      .leftJoin(Product, eq(ProductView.product_id, Product.id))
      .leftJoin(Country, eq(ProductView.country_id, Country.id))
      .leftJoin(CountryGroup, eq(Country.country_group_id, CountryGroup.id))
      .where(eq(Product.user_id, userId))
      .groupBy(CountryGroup.name)
      .orderBy(CountryGroup.name);

    // Filter out entries where parityGroupName is null
    return result
      .filter(r => r.parityGroupName !== null)
      .map(r => ({
        name: r.parityGroupName as string,
        visitors: r.visitorCount,
      }));

  } catch (error) {
    console.error("Error fetching visitors by parity group:", error);
    return []; 
  }
});

export interface VisitorsByCountryData {
  name: string;
  visitors: number;
}

export const getVisitorsByCountry = withAuthUserId(async (userId: string): Promise<VisitorsByCountryData[]> => {
  try {
    const result = await db
      .select({
        countryName: Country.name,
        visitorCount: count(ProductView.id),
      })
      .from(ProductView)
      .leftJoin(Product, eq(ProductView.product_id, Product.id))
      .leftJoin(Country, eq(ProductView.country_id, Country.id))
      .where(eq(Product.user_id, userId))
      .groupBy(Country.name)
      .orderBy((cols) => sql`${cols.visitorCount} DESC`)
      .limit(10);

    return result
      .filter(r => r.countryName !== null)
      .map(r => ({
        name: r.countryName as string,
        visitors: r.visitorCount,
      }));

  } catch (error) {
    console.error("Error fetching visitors by country:", error);
    return []; 
  }
});

export interface VisitorsByDayData {
  date: string;
  visitors: number;
}

export const getVisitorsByDay = withAuthUserId(async (userId: string): Promise<VisitorsByDayData[]> => {
  try {
    const result = await db
      .select({
        date: sql`DATE(${ProductView.visited_at})`.as("date"),
        visitorCount: count(ProductView.id),
      })
      .from(ProductView)
      .leftJoin(Product, eq(ProductView.product_id, Product.id))
      .where(eq(Product.user_id, userId))
      .groupBy(sql`DATE(${ProductView.visited_at})`)
      .orderBy((cols) => sql`${cols.date}`)
      .limit(30); // Last 30 days

    return result.map(r => ({
      date: r.date as string,
      visitors: r.visitorCount,
    }));

  } catch (error) {
    console.error("Error fetching visitors by day:", error);
    return []; 
  }
});

export interface MostViewedProductData {
  name: string;
  visitors: number;
}

export const getMostViewedProducts = withAuthUserId(async (userId: string): Promise<MostViewedProductData[]> => {
  try {
    const result = await db
      .select({
        productName: Product.name,
        visitorCount: count(ProductView.id),
      })
      .from(ProductView)
      .leftJoin(Product, eq(ProductView.product_id, Product.id))
      .where(eq(Product.user_id, userId))
      .groupBy(Product.name)
      .orderBy((cols) => sql`${cols.visitorCount} DESC`)
      .limit(10);

    return result
      .filter(r => r.productName !== null)
      .map(r => ({
        name: r.productName as string,
        visitors: r.visitorCount,
      }));

  } catch (error) {
    console.error("Error fetching most viewed products:", error);
    return [];
  }
}); 