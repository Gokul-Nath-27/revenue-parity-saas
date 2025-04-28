"use client"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useBanner } from './BannerContext';

export function BannerPositionPicker() {
  const { bannerPosition, setBannerPosition } = useBanner();

  const positions = [
    { value: 'top', label: 'Top of page' },
    { value: 'bottom', label: 'Bottom of page' },
  ];

  return (
      <RadioGroup value={bannerPosition} onValueChange={setBannerPosition}>
        {positions.map((position) => (
          <div key={position.value} className="flex items-center space-x-2">
            <RadioGroupItem value={position.value} id={position.value} />
            <Label htmlFor={position.value}>{position.label}</Label>
          </div>
        ))}
      </RadioGroup>
  );
} 