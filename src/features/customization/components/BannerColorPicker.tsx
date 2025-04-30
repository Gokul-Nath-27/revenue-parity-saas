"use client"
import { cn } from '@/lib/utils';

import { useBanner } from './BannerContext';
const colors = [
  'from-primary/20 to-blue-600/20',
  'from-purple-600/20 to-pink-600/20',
  'from-blue-600/20 to-cyan-600/20',
  'from-emerald-600/20 to-yellow-600/20'
];

export function BannerColorPicker() {
  const { bannerColor, setBannerColor } = useBanner();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {colors.map((color, i) => (
        <button
          key={i}
          type="button"
          className={cn(
            "w-8 h-8 rounded-full bg-gradient-to-r cursor-pointer",
            color,
            bannerColor === color ? "ring-2 ring-primary" : "ring-1 ring-muted"
          )}
          onClick={() => setBannerColor(color)}
        />
      ))}
    </div>
  );
}