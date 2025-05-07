import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function catchError<T>(
  promise: Promise<T>
): Promise<{ error: Error | undefined; data: T | undefined }> {
  try {
    const data = await promise;
    return { error: undefined, data };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error, data: undefined };
  }
}

export const generateIntials = (name: string) => {
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const firstNameInitial = firstName.charAt(0).toUpperCase();
  const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

  return `${firstNameInitial}${lastNameInitial}`;
};

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, "")
}

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}



export async function generateBannerJS(
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

    const locationMessage = product.customization.location_message || ''
    const bannerContainer = product.customization.banner_container || 'body'
    const backgroundColor = product.customization.background_color || '#ffffff'
    const textColor = product.customization.text_color || '#000000'
    const fontSize = product.customization.font_size || '16px'
    const bannerRadius = product.customization.banner_radius || '0px'
    const isSticky = product.customization.sticky || false
    
    const bannerHTML = `
      <div style="
        background-color: ${backgroundColor};
        color: ${textColor};
        font-size: ${fontSize};
        border-radius: ${bannerRadius};
        padding: 10px;
        text-align: center;
        ${isSticky ? 'position: sticky; top: 0;' : ''}
      ">
        ${locationMessage.replace('{country}', country.name)
          .replace('{coupon}', discount.coupon)
          .replace('{discount}', (discount.percentage * 100).toString())}
        ${!canRemoveBranding ? '<div style="font-size: 12px; margin-top: 5px;">Powered by <a href="https://revenue-parity.vercel.app" target="_blank">revenue-parity</a></div>' : ''}
      </div>
    `.trim()

    return `
      window.addEventListener('load', function() {
        try {
          const inject = document.createElement("div");
          inject.innerHTML = '${bannerHTML.replace(/'/g, "\\'")}';
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

export const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : process.env.BASE_URL_DEV;
