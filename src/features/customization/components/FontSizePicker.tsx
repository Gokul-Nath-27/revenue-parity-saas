"use client"
import { useBanner } from './BannerContext';

const sizes = [
  { value: '0.875rem', label: 'Small' },
  { value: '1rem', label: 'Medium' },
  { value: '1.125rem', label: 'Large' },
  { value: '1.25rem', label: 'X-Large' },
];

export function FontSizePicker() {
  const { customization, setBanner } = useBanner();
  const { font_size } = customization;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input type="hidden" name='font_size' value={font_size} />
      {sizes.map((size) => (
        <button
          key={size.value}
          type="button"
          className={`px-3 py-1 border ${font_size === size.value ? 'border-primary bg-primary/10' : 'border-muted'}`}
          onClick={() => setBanner({ font_size: size.value })}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
} 