"use client"
import { Input } from '@/components/ui/input';

import { useBanner } from './BannerContext';
const container_examples = [
  '.banner-container',
  '#header',
  'body',
]

export function BannerContainerPicker() {
  const { customization, setBanner, canCustomizeBanner } = useBanner();
  const { banner_container } = customization;


  return (
    <>
      <Input
        disabled={!canCustomizeBanner}
        name="banner_container"
        value={banner_container}
        onChange={(e) => setBanner({ banner_container: e.target.value })}
      />
      <p className="text-xs text-muted-foreground">
        Enter the CSS selector for the container of the banner.
        <br />
        <span className="flex gap-1">
          (e.g.{container_examples.map((example) => (
            <code key={example} className="bg-muted px-1 py-0.5 rounded text-[10px]">{example}</code>
          ))})
        </span>
      </p>
    </>
  );
} 