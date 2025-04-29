"use client"
import { useBanner } from './BannerContext';

const colors = [
  'hsl(0, 0%, 100%)', // white
  'hsl(0, 0%, 0%)',   // black
  'hsl(0, 0%, 20%)',  // dark gray
  'hsl(0, 0%, 80%)',  // light gray
];

export function TextColorPicker() {
  const { textColor, setTextColor } = useBanner();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {colors.map((color, i) => (
        <button
          key={i}
          type="button"
          className={`w-8 h-8 rounded-full ${textColor === color ? 'ring-2 ring-primary' : 'ring-1 ring-muted'}`}
          style={{ backgroundColor: color }}
          onClick={() => setTextColor(color)}
        />
      ))}
    </div>
  );
} 