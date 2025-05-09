"use client"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useBanner } from './BannerContext';

const radiusLookUp = {
  '10px': { style: 'rounded-md', label: 'md' },
  '20px': { style: 'rounded-xl', label: 'lg' },
  '0px': { style: 'rounded-none', label: 'none' }
}
export function BannerRadiusPicker() {
  const { customization, setBanner, canCustomizeBanner } = useBanner();
  const { banner_radius } = customization;

  return (
    <div className="flex items-center gap-2 mt-2">
      <input type="hidden" name="banner_radius" value={banner_radius} />
      {Object.entries(radiusLookUp).map(([radius, { style, label }], i) => (
        <Button
          key={i}
          type="button"
          disabled={!canCustomizeBanner}
          className={cn(
            'px-3 py-1 border',
            style
          )}
          variant={banner_radius === radius ? 'default' : 'outline'}
          onClick={() => setBanner({ banner_radius: radius })}
        >
          {label}
        </Button>
      ))}
    </div>
  );
} 