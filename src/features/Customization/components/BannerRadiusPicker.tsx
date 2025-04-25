"use client"
import { useBanner } from './BannerContext';

export function BannerRadiusPicker() {
  const { bannerStyle, setBannerStyle } = useBanner();

  const styles = [
    'rounded-md',
    'rounded-xl',
    'rounded-none'
  ];

  return (
    <div className="flex items-center gap-2 mt-2">
      {styles.map((style, i) => (
        <button
          key={i}
          type="button"
          className={`px-3 py-1 border ${bannerStyle === style ? 'border-primary bg-primary/10' : 'border-muted'} ${style}`}
          onClick={() => setBannerStyle(style)}
        >
          {style.replace('rounded-', '')}
        </button>
      ))}
    </div>
  );
} 