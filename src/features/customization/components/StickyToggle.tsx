"use client"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useBanner } from './BannerContext';

export function StickyToggle() {
  const { customization: { sticky }, setBanner } = useBanner();

  return (
    <div className="flex items-center space-x-2">
      <input type="hidden" name="sticky" value={sticky ? 'true' : 'false'} />
      <Switch
        id="sticky-toggle"
        checked={sticky}
        onCheckedChange={(value) => setBanner({ sticky: value })}
      />
      <Label htmlFor="sticky-toggle">Sticky Banner</Label>
    </div>
  );
} 