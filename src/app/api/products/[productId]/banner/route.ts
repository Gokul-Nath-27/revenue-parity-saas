export const runtime = 'edge';

import { NextRequest } from "next/server"
import { createElement } from "react"

import { BannerPreview } from "@/features/customization/components/BannerPreview"
import { getProductForBanner , createProductView } from "@/features/products/db"
import { catchError, removeTrailingSlash } from "@/lib/utils"
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
  try {
    console.log("Starting generateBannerJS")
    
    // Validate required product properties
    if (!product.customization) {
      console.error("Missing product customization")
      throw new Error("Product customization is missing")
    }
    
    // Validate country and discount
    if (!country || !country.name) {
      console.error("Invalid country data")
      throw new Error("Country data is invalid")
    }
    
    if (!discount || typeof discount.percentage !== 'number' || !discount.coupon) {
      console.error("Invalid discount data")
      throw new Error("Discount data is invalid")
    }

    const { renderToStaticMarkup } = await import("react-dom/server")
    
    // Safely access customization properties
    const locationMessage = product.customization.location_message || ''
    const bannerContainer = product.customization.banner_container || 'body'
    
    // Create the banner HTML with proper error handling
    let bannerHTML
    try {
      bannerHTML = renderToStaticMarkup(
        createElement(BannerPreview, {
          location_message: locationMessage,
          mappings: {
            country: country.name,
            coupon: discount.coupon,
            discount: (discount.percentage * 100).toString(),
          },
          customization: product.customization,
          canRemoveBranding,
        })
      )
      console.log("Banner HTML generated successfully")
    } catch (error) {
      console.error("Error generating banner HTML:", error)
      throw new Error("Failed to render banner HTML")
    }

    return `
      window.addEventListener('load', function() {
        try {
          const inject = document.createElement("div");
          inject.innerHTML = '${bannerHTML}';
          const injectingContainer = document.querySelector("${bannerContainer}");
          if (injectingContainer) {
            injectingContainer.prepend(inject);
          } else {
            console.log('The banner injection container is not found');
          }
        } catch (e) {
          console.error('Error injecting banner:', e);
        }
      });
    `.replace(/(\r\n|\n|\r)/g, "")
  } catch (error) {
    console.error("Error in generateBannerJS:", error)
    throw error
  }
}

function getCountryCode(request: NextRequestWithGeo) {
    if (request.geo?.country) {
      console.log("Using geo country code:", request.geo.country)
      return request.geo.country
    } else { 
      return null
    }

}