"use client"
import { useBanner } from './BannerContext';

export function BannerPreview() {
  const {
    bannerColor,
    bannerStyle,
    customMessage,
    textColor,
    fontSize,
    isSticky
  } = useBanner();

  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Preview</h3>

      <div
        className={`w-full bg-gradient-to-r ${bannerColor} p-3 ${bannerStyle} border border-white/10 relative ${isSticky ? 'sticky top-0' : ''}`}
        style={{ color: textColor, fontSize }}
      >
        <div className="flex-col -center">
          <p className="text-xs opacity-70">Based on your location (India)</p>
          <p className="font-semibold">
            {customMessage || "30% OFF with code: INDIA30"}
          </p>
        </div>
      </div>
    </div>
  );
} 