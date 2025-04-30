'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Server component for static banner configuration
export function BannerConfig() {
  return {
    defaultColor: 'from-primary/20 to-blue-600/20',
    defaultStyle: 'rounded-md',
    defaultPosition: 'top',
    defaultTextColor: 'hsl(0, 0%, 100%)',
    defaultFontSize: '1rem',
    defaultContainer: 'body',
    defaultIsSticky: true,
  };
}

// Client component for banner display
export function Banner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const config = BannerConfig();

  const bannerColor = searchParams.get('color') || config.defaultColor;
  const bannerStyle = searchParams.get('style') || config.defaultStyle;
  const customMessage = searchParams.get('message') || '';
  const bannerPosition = searchParams.get('position') || config.defaultPosition;
  const textColor = searchParams.get('textColor') || config.defaultTextColor;
  const fontSize = searchParams.get('fontSize') || config.defaultFontSize;
  const bannerContainer = searchParams.get('container') || config.defaultContainer;
  const isSticky = searchParams.get('sticky') === 'true' || config.defaultIsSticky;

  const updateBanner = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  return {
    bannerColor,
    bannerStyle,
    customMessage,
    bannerPosition,
    textColor,
    fontSize,
    bannerContainer,
    isSticky,
    updateBanner,
  };
} 