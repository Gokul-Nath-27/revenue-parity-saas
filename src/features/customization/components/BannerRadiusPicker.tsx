"use client"
import { cn } from '@/lib/utils';

import { useBanner } from './BannerContext';

const radiusLookUp = {
  '10px': { style: 'rounded-md', label: 'md' },
  '20px': { style: 'rounded-xl', label: 'lg' },
  '0px': { style: 'rounded-none', label: 'none' }
}
export function BannerRadiusPicker() {
  const { customization, setBanner } = useBanner();
  const { banner_radius } = customization;

  return (
    <div className="flex items-center gap-2 mt-2">
      <input type="hidden" name="banner_radius" value={banner_radius} />
      {Object.entries(radiusLookUp).map(([radius, { style, label }], i) => (
        <button
          key={i}
          type="button"
          className={cn(
            'px-3 py-1 border',
            { 'border-primary bg-primary/10': banner_radius === radius, 'border-muted': banner_radius !== radius },
            style
          )}
          onClick={() => setBanner({ banner_radius: radius })}
        >
          {label}
        </button>
      ))}
    </div>
  );
} 