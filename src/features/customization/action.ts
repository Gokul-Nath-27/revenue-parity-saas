"use server"

import { z } from "zod";

const siteConfigSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().optional(),
  domain: z.string().url(),
});

export type SiteConfigFormData = z.infer<typeof siteConfigSchema>;

type State = {
  success: boolean;
  message: string;
  errors: Record<string, string[] | undefined>;
};

export async function updateSiteConfig(
  prevState: State,
  formData: FormData
): Promise<State> {
  // Validate the form data
  const validatedFields = siteConfigSchema.safeParse({
    siteName: formData.get("siteName"),
    siteDescription: formData.get("siteDescription"),
    domain: formData.get("domain"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // TODO: Save the data to your database or storage
  
  return {
    success: true,
    message: "Site configuration updated successfully",
    errors: {},
  };
}

export async function updateBannerConfig(prevState: State, formData: FormData) {
  try {
    const bannerColor = formData.get('bannerColor');
    const bannerRadius = formData.get('bannerRadius');
    const bannerMessage = formData.get('bannerMessage');
    const bannerPosition = formData.get('bannerPosition');
    const textColor = formData.get('textColor');
    const fontSize = formData.get('fontSize');
    const bannerContainer = formData.get('bannerContainer');
    const isSticky = formData.get('isSticky') === 'true';

    console.log({
      bannerColor,
      bannerRadius,
      bannerMessage,
      bannerPosition,
      textColor,
      fontSize,
      bannerContainer,
      isSticky
    });

    // TODO: Add your API call here to update the banner configuration

    return {
      success: true,
      message: "Banner configuration updated successfully",
      errors: {},
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update banner configuration",
      errors: {
        bannerColor: ["Invalid banner color"],
        bannerRadius: ["Invalid banner radius"],
        bannerMessage: ["Invalid banner message"],
        bannerPosition: ["Invalid banner position"],
        textColor: ["Invalid text color"],
        fontSize: ["Invalid font size"],
        bannerContainer: ["Invalid banner container"],
        isSticky: ["Invalid sticky setting"],
      },
    };
  }
} 