import { z } from "zod";

export const productCustomizationSchema = z.object({
  class_prefix: z.string().optional(),
  background_color: z.string().min(1, "Required"),
  text_color: z.string().min(1, "Required"),
  font_size: z.string().min(1, "Required"),
  location_message: z.string().min(1, "Required"),
  banner_container: z.string().min(1, "Required"),
  sticky: z.coerce.boolean(),
})