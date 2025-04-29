"use client"
import { useBanner } from './BannerContext';

const sizes = [
  { value: '0.875rem', label: 'Small' },
  { value: '1rem', label: 'Medium' },
  { value: '1.125rem', label: 'Large' },
  { value: '1.25rem', label: 'X-Large' },
];

export function FontSizePicker() {
  const { fontSize, setFontSize } = useBanner();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {sizes.map((size) => (
        <button
          key={size.value}
          type="button"
          className={`px-3 py-1 border ${fontSize === size.value ? 'border-primary bg-primary/10' : 'border-muted'}`}
          onClick={() => setFontSize(size.value)}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
} 