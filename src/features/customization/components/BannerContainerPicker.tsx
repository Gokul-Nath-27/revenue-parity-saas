"use client"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useBanner } from './BannerContext';

export function BannerContainerPicker() {
  const { bannerContainer, setBannerContainer } = useBanner();

  const containers = [
    { value: 'body', label: 'Entire Page' },
    { value: 'header', label: 'Header' },
    { value: 'main', label: 'Main Content' },
  ];

  return (
    <RadioGroup value={bannerContainer} onValueChange={setBannerContainer}>
      {containers.map((container) => (
        <div key={container.value} className="flex items-center space-x-2">
          <RadioGroupItem value={container.value} id={container.value} />
          <Label htmlFor={container.value}>{container.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
} 