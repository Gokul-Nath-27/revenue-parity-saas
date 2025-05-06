export const runtime = 'edge';

import { notFound } from "next/navigation"
import { NextRequest } from "next/server"
import { createElement } from "react"

import { BannerPreview } from "@/features/customization/components/BannerPreview"
import { getProductForBanner , createProductView } from "@/features/products/db"
import { removeTrailingSlash } from "@/lib/utils"
import { canRemoveBranding, canShowDiscountBanner } from "@/permissions"

// Define interface for NextRequest with geo property
interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
  };
}

export async function GET(
  request: NextRequestWithGeo,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    
    const referer = request.headers.get("referer");
    const origin = request.headers.get("origin");
    const requestingUrl = referer || origin || request.nextUrl.origin;
    
    const countryCode = getCountryCode(request)
    if (countryCode == null) return notFound()
    
    const normalizedUrl = removeTrailingSlash(requestingUrl).replace("localhost", "127.0.0.1")

    let { product, discount, country } = await getProductForBanner({
      id: productId,
      countryCode,
      url: normalizedUrl,
    })

    // // If product is null and we're in development mode, log the error and try again without domain verification
    if (product == null && process.env.NODE_ENV === "development") {
      console.log("Domain verification failed - URL does not match product domain")
      console.log("Attempting to bypass domain verification in development mode")
      
      try {
        // We need to access the database directly for this part
        const db = (await import("@/drizzle/db")).default
        const { Product } = await import("@/drizzle/schemas")
        const { eq } = await import("drizzle-orm")
        
        // Fetch product directly without domain verification
        const rawProduct = await db.query.Product.findFirst({
          where: eq(Product.id, productId),
          with: {
            product_customization: true,
          },
        })
        
        if (rawProduct && rawProduct.product_customization) {
          // Transform to expected format
          product = {
            id: rawProduct.id,
            user_id: rawProduct.user_id,
            customization: rawProduct.product_customization
          }
          
          // Since we're in development and bypassing domain verification,
          // also create mock country and discount if they're not already set
          if (country == null) {
            country = { 
              name: countryCode === "IN" ? "India" : "United States",
              id: "mock-country-id"
            };
          }
          
          if (discount == null) {
            discount = { 
              coupon: `${countryCode}30`, 
              percentage: 0.3
            };
          }
        }
        
        console.log("Successfully bypassed domain verification in development")
      } catch (error) {
        console.error("Failed to bypass domain verification:", error)
      }
    }

    if (product == null) return notFound()
    
    // Create the product view regardless of discount
    try {
      await createProductView({
        productId: product.id,
        countryId: country?.id,
      })
    } catch (error) {
      // Log but continue even if product view creation fails
      console.error("Error creating product view:", error)
    }
    
    // For development, we'll show a banner with mock data if country/discount is missing
    if (process.env.NODE_ENV === "development" && (country == null || discount == null)) {
      console.log("Using mock data for development banner");
      
      // If we have the product but missing country/discount, use mock data
      const mockCountry = { 
        name: countryCode === "IN" ? "India" : "United States",
        id: "mock-country-id"
      };
      
      country = country || mockCountry;
      
      discount = discount || { 
        coupon: `${countryCode}30`, 
        percentage: 0.3
      };
      
      console.log("Development banner data:", { country, discount });
    } else if (country == null || discount == null) {
      return new Response("No Discount can be applied for this product/location", { status: 203 });
    }
    const canShowBanner = await canShowDiscountBanner(product.user_id)
    if (!canShowBanner) return notFound()
    
    // Generate the banner JavaScript with HTML template
    const bannerJS = await generateBannerJS(
      product,
      country,
      discount,
      await canRemoveBranding(product.user_id)
    )
    
    return new Response(bannerJS, {
      headers: {
        "Content-Type": "application/javascript",
      },
    })
  } catch (error) {
    console.error("Error in banner API:", error)
    return new Response("Error generating banner", { status: 500 })
  }
}

async function generateBannerJS(
  product: {
    id: string;
    user_id: string;
    customization: {
      id: string;
      class_prefix: string | null;
      product_id: string;
      location_message: string;
      background_color: string;
      text_color: string;
      banner_container: string;
      sticky: boolean;
      font_size: string;
      banner_radius: string;
      created_at: Date;
      updated_at: Date;
    };
  },
  country: { name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean
) {
  const { renderToStaticMarkup } = await import("react-dom/server")
  return `
      window.addEventListener('load', function() {
        const inject = document.createElement("div");
        inject.innerHTML = '${renderToStaticMarkup(
          createElement(BannerPreview, {
            location_message: product.customization.location_message,
            mappings: {
              country: country.name,
              coupon: discount.coupon,
              discount: (discount.percentage * 100).toString(),
            },
            customization: product.customization,
            canRemoveBranding,
          })
        )}';
        const injectingContainer = document.querySelector("${
          product.customization.banner_container
        }");
        if (injectingContainer) {
          injectingContainer.prepend(inject);
        } else {
          console.log('The banner injection container is not found');
        }
      });
    `.replace(/(\r\n|\n|\r)/g, "")
}


function getCountryCode(request: NextRequestWithGeo) {
  if (request.geo?.country != null) return request.geo.country
  if (process.env.NODE_ENV === "development") {
    return process.env.TEST_COUNTRY_CODE
  }
}