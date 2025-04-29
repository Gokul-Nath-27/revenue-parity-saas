"use client"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useBanner } from './BannerContext';

export function StickyToggle() {
  const { isSticky, setIsSticky } = useBanner();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="sticky-toggle"
        checked={isSticky}
        onCheckedChange={setIsSticky}
      />
      <Label htmlFor="sticky-toggle">Sticky Banner</Label>
    </div>
  );
} 