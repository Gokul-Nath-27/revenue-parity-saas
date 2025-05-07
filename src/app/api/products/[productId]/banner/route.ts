export const runtime = 'edge';

import { NextRequest } from "next/server"

import { getProductForBanner , createProductView } from "@/features/products/db"
import { catchError, generateBannerJS, removeTrailingSlash } from "@/lib/utils"
import { canRemoveBranding, canShowDiscountBanner } from "@/permissions"

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
    console.log("countryCode", countryCode)

    if (countryCode == null) {
      console.log("No country code found, returning 404")
      return errorResponse("Unable to determine country location. Please ensure location services are enabled.")
    }

    const normalizedUrl = removeTrailingSlash(requestingUrl).replace("localhost", "127.0.0.1")

    const { data: result, error } = await catchError(getProductForBanner({
      id: productId,
      countryCode,
      url: normalizedUrl,
    }))
    
    if (error) {
      console.error("Error in getProductForBanner:", error)
      return errorResponse( "Unable to retrieve product information. Please try again later.")
    }
    
    if (!result?.product) {
      console.log("No result returned from getProductForBanner")
      return errorResponse("The requested product could not be found.")
    }

    const { product, discount, country } = result
    if (!country || !discount) {
      console.log("No country or discount available")
      return errorResponse("No discount can be applied for this product/location.")
    }

    console.log({
      product,
      discount,
      country,
    })

    const { error: createProductViewError } = await catchError(createProductView({
      productId: product.id,
      countryId: country.id,
    }))

    if (createProductViewError) {
      console.error("Error creating product view:", createProductViewError)
    }

    const { data: canShowBanner, error: canShowBannerError } = await catchError(canShowDiscountBanner(product.user_id))
    if (canShowBannerError) {
      console.error("Error checking if can show banner:", canShowBannerError)
    }
    
    if (!canShowBanner) {
      console.log("Cannot show banner for this user")
      return new Response("Cannot show banner for this user", { status: 203 })
    }
    
    const { data: canRemoveBrand, error: canRemoveBrandError } = await catchError(canRemoveBranding(product.user_id))
    if (canRemoveBrandError) {
      console.error("Error checking if can remove branding:", canRemoveBrandError)
    }
    
    const { data: bannerJS, error: bannerJSError } =
      await catchError(
        generateBannerJS(
          product,
          country,
          discount,
          canRemoveBrand ?? false
        )
      )
    
    if (bannerJSError) {
      console.error("Error generating banner JS:", bannerJSError)
    }
    
    console.log("Banner JS generated successfully")
    
    
    return new Response(bannerJS, {
      headers: {
        "Content-Type": "application/javascript",
      },
    })
  } catch (error) {
    console.error("Unhandled error in banner API:", error)
    return new Response("Error generating banner", { status: 500 })
  }
}

const errorResponse = (message: string) => {
  return new Response(JSON.stringify({
    error: "Error generating banner",
    message: message
  }), { 
    status: 203,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getCountryCode(request: NextRequestWithGeo) {
  return request.geo?.country || process.env.TEST_COUNTRY_CODE || null
}

interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
  };
}