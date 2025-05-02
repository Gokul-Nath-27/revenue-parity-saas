"use client"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useBanner } from './BannerContext';

export function StickyToggle() {
  const { customization: { sticky }, setBanner } = useBanner();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="sticky-toggle"
        name="sticky"
        checked={sticky}
        onCheckedChange={(value) => setBanner({ sticky: value })}
      />
      <Label htmlFor="sticky-toggle">Sticky Banner</Label>
    </div>
  );
} 