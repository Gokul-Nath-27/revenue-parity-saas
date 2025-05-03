"use client"
import { Input } from "@/components/ui/input";

import { useBanner } from "./BannerContext";

export function ClassPrefixInput() {
  const { customization, setBanner, canCustomizeBanner } = useBanner();
  const { class_prefix } = customization;

  return (
    <Input
      disabled={!canCustomizeBanner}
      name="class_prefix"
      value={class_prefix || ""}
      onChange={(e) => setBanner({ class_prefix: e.target.value })}
    />
  );
}
