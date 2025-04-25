"use client"
import { Check, Palette } from "lucide-react";
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { updateBannerConfig } from '../action';

import { BannerColorPicker } from "./BannerColorPicker";
import { useBanner } from './BannerContext';
import { BannerMessageInput } from "./BannerMessageInput";
import { BannerPositionPicker } from "./BannerPositionPicker";
import { BannerRadiusPicker } from "./BannerRadiusPicker";

type FormState = {
  success: boolean;
  message: string;
  errors: {
    bannerColor?: string[];
    bannerRadius?: string[];
    bannerMessage?: string[];
    bannerPosition?: string[];
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full gap-2" disabled={pending}>
      <Check className="h-4 w-4" /> {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

const initialState: FormState = {
  success: false,
  message: "",
  errors: {}
};
export function BannerApperanceForm() {
  const { bannerColor, bannerStyle, customMessage, bannerPosition } = useBanner();

  const [state, formAction] = useActionState<FormState, FormData>(updateBannerConfig, initialState);

  // Show toast message when form submission completes
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Card className="md:col-span-2 h-full">
      <CardContent className="h-full flex flex-col">
        <div className="space-y-6 flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Banner Appearance</h3>
            <Palette className="h-5 w-5 text-muted-foreground" />
          </div>

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="bannerColor" value={bannerColor} />
            <input type="hidden" name="bannerRadius" value={bannerStyle} />
            <input type="hidden" name="bannerMessage" value={customMessage} />
            <input type="hidden" name="bannerPosition" value={bannerPosition} />

            <div className="space-y-2">
              <Label>Banner Color</Label>
              <BannerColorPicker />
              {state.errors?.bannerColor && (
                <p className="text-xs text-destructive">{state.errors.bannerColor[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Banner Radius</Label>
              <BannerRadiusPicker />
              {state.errors?.bannerRadius && (
                <p className="text-xs text-destructive">{state.errors.bannerRadius[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Banner Message</Label>
              <BannerMessageInput />
              <p className="text-xs text-muted-foreground">
                Leave blank to use our default message optimized for each country
              </p>
              {state.errors?.bannerMessage && (
                <p className="text-xs text-destructive">{state.errors.bannerMessage[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Banner Position</Label>
              <BannerPositionPicker />
              {state.errors?.bannerPosition && (
                <p className="text-xs text-destructive">{state.errors.bannerPosition[0]}</p>
              )}
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