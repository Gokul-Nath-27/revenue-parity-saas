"use client"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // assuming you have a Radio component

import { useBanner } from './BannerContext';

const sizes = [
  { value: '0.875rem', label: 'Small' },
  { value: '1rem', label: 'Medium' },
  { value: '1.125rem', label: 'Large' },
  { value: '1.25rem', label: 'X-Large' },
];

export function FontSizePicker() {
  const { customization, setBanner, canCustomizeBanner } = useBanner();
  const { font_size } = customization;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input type="hidden" name='font_size' value={font_size} />
      <RadioGroup
        disabled={!canCustomizeBanner}
        className='flex'
        value={font_size}
        onValueChange={(value) => setBanner({ font_size: value })}
      >
        {sizes.map(({ label, value }) => (
          <div key={value} className="flex items-center space-x-2">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
} 