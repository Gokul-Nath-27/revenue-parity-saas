export const runtime = 'edge';

import { notFound } from "next/navigation"
import { NextRequest } from "next/server"
import { createElement } from "react"

import { BannerPreview } from "@/features/customization/components/BannerPreview"
import { getProductForBanner , createProductView } from "@/features/products/db"
import { removeTrailingSlash } from "@/lib/utils"
import { canRemoveBranding, canShowDiscountBanner } from "@/permissions"

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
    console.log("productId", productId)
    
    const referer = request.headers.get("referer");
    const origin = request.headers.get("origin");
    const requestingUrl = referer || origin || request.nextUrl.origin;
    console.log({
      referer,
      origin,
      requestingUrl,
    })
    
    const countryCode = getCountryCode(request)
    if (countryCode == null) return notFound()
    console.log("countryCode", countryCode)
    
    const normalizedUrl = removeTrailingSlash(requestingUrl).replace("localhost", "127.0.0.1")
    console.log("normalizedUrl", normalizedUrl)
    const { product, discount, country } = await getProductForBanner({
      id: productId,
      countryCode,
      url: normalizedUrl,
    })
    console.log("product", product)
    if (product == null) return notFound()
    
    if (country == null || discount == null) {
      return new Response("No Discount can be applied for this product/location", { status: 203 });
    }
    console.log({
      country,
      discount,
    })

    try {
      await createProductView({
        productId: product.id,
        countryId: country?.id,
      })
    } catch (error) {
      console.error("Error creating product view:", error)
    }

    const canShowBanner = await canShowDiscountBanner(product.user_id)
    console.log("canShowBanner", canShowBanner)
    if (!canShowBanner) return notFound()
    
    const bannerJS = await generateBannerJS(
      product,
      country,
      discount,
      await canRemoveBranding(product.user_id)
    )
    console.log("bannerJS", bannerJS)
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