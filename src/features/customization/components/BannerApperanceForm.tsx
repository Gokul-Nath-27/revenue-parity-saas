"use client"
import { Check, Palette } from "lucide-react";
import { useFormStatus } from 'react-dom';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// import { updateBannerConfig } from '../action';

import { BannerColorPicker } from "./BannerColorPicker";
import { BannerContainerPicker } from "./BannerContainerPicker";
import { useBanner } from './BannerContext';
import { BannerMessageInput } from "./BannerMessageInput";
import { BannerPositionPicker } from "./BannerPositionPicker";
import { BannerRadiusPicker } from "./BannerRadiusPicker";
import { FontSizePicker } from "./FontSizePicker";
import { StickyToggle } from "./StickyToggle";
import { TextColorPicker } from "./TextColorPicker";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full gap-2" disabled={pending}>
      <Check className="h-4 w-4" /> {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function BannerApperanceForm() {
  const {
    bannerColor,
    bannerStyle,
    customMessage,
    bannerPosition,
    textColor,
    fontSize,
    bannerContainer,
    isSticky
  } = useBanner();

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

          <form className="space-y-6">
            <input type="hidden" name="bannerColor" value={bannerColor} />
            <input type="hidden" name="bannerRadius" value={bannerStyle} />
            <input type="hidden" name="bannerMessage" value={customMessage} />
            <input type="hidden" name="bannerPosition" value={bannerPosition} />
            <input type="hidden" name="textColor" value={textColor} />
            <input type="hidden" name="fontSize" value={fontSize} />
            <input type="hidden" name="bannerContainer" value={bannerContainer} />
            <input type="hidden" name="isSticky" value={isSticky.toString()} />

            <div className="space-y-2">
              <Label>Banner Color</Label>
              <BannerColorPicker />
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <TextColorPicker />
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
              <Label>Banner Position</Label>
              <BannerPositionPicker />
            </div>

            <div className="space-y-2">
              <Label>Banner Container</Label>
              <BannerContainerPicker />
            </div>

            <div className="space-y-2">
              <StickyToggle />
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 