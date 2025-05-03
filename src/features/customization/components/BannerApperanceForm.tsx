"use client"

import { Palette } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import SubmitButton from "@/components/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { updateBannerCustomization } from "@/features/customization/action";

import { BannerContainerPicker } from "./BannerContainerPicker";
import { BannerMessageInput } from "./BannerMessageInput";
import { BannerRadiusPicker } from "./BannerRadiusPicker";
import { ClassPrefixInput } from "./ClassPrefixInput";
import ReactColorPicker from "./ColorPicker";
import { FontSizePicker } from "./FontSizePicker";
import { StickyToggle } from "./StickyToggle";

export function BannerApperanceForm({ productId }: { productId: string }) {
  const [state, formAction] = useActionState(updateBannerCustomization, {
    error: false,
    message: "",
  })

  useEffect(() => {
    if (state.error) {
      toast.error(state.message)
    } else if (state.message) {
      toast.success(state.message)
    }
  }, [state.error, state.message])

  return (
    <Card className="md:col-span-2 h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
      <CardContent className="h-full flex flex-col relative z-10">
        <div className="space-y-6 flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Banner Appearance</h3>
            <Palette className="h-5 w-5 text-muted-foreground" />
          </div>

          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="productId" value={productId} />
            <div className="flex items-center gap-2 w-full">
              <div className="space-y-2 w-full">
                <Label>Background Color</Label>
                <ReactColorPicker name="background_color" />
              </div>
              <div className="space-y-2 w-full">
                <Label>Text Color</Label>
                <ReactColorPicker name="text_color" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <FontSizePicker />
            </div>

            <div className="space-y-2">
              <Label>Banner Radius</Label>
              <BannerRadiusPicker />
            </div>

            <div className="space-y-2">
              <Label>Banner Message</Label>
              <BannerMessageInput />
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span>Parameters:</span>
                <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{'{country}'}</code>
                <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{'{coupon}'}</code>
                <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{'{discount}'}</code>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Banner Container</Label>
              <BannerContainerPicker />
            </div>

            <div className="space-y-2">
              <Label>Class Prefix</Label>
              <ClassPrefixInput />
            </div>

            <div className="space-y-2">
              <StickyToggle />
            </div>

            <div className="pt-4 ">
              <SubmitButton />
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 