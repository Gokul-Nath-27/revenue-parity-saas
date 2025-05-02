"use server";
export async function updateBannerCustomization(formData: FormData) {
  const rawData = Object.fromEntries(formData);

  console.log(rawData);
}
