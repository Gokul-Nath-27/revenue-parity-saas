"use client"
import { Info } from 'lucide-react';
import React, { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { updateSiteConfig } from '../action';


type FormState = {
  success: boolean;
  message: string;
  errors: {
    name?: string[];
    siteDescription?: string[];
    domain?: string[];
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Information"}
    </Button>
  );
}

export function SiteInfoForm() {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {}
  };

  const [state, formAction] = useActionState<FormState, FormData>(updateSiteConfig, initialState);

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
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Site Information</h3>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Site Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="My Digital Product Store"
            defaultValue=""
            required
          />
          {state.errors?.name && (
            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteDescription">Site Description</Label>
          <Textarea
            id="siteDescription"
            name="siteDescription"
            placeholder="A brief description of your site and products..."
            className="resize-none h-32"
            defaultValue=""
          />
          {state.errors?.siteDescription && (
            <p className="text-xs text-destructive">{state.errors.siteDescription[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="domain">Domain</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Enter your domain to connect it with your RevenueParity site.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="domain"
            name="domain"
            placeholder="yourdomain.com"
            defaultValue=""
            required
          />
          <p className="text-xs text-muted-foreground">
            Enter your domain without http:// or https://
          </p>
          {state.errors?.domain && (
            <p className="text-xs text-destructive">{state.errors.domain[0]}</p>
          )}
        </div>

        <div className="pt-2 cursor-pointer">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
} 