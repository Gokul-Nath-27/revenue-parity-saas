"use client"
import { Input } from '@/components/ui/input';

import { useBanner } from './BannerContext';

const DEFAULT_MESSAGE = "Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>{coupon}</b> to get <b>{discount}%</b> off.";

export function BannerMessageInput() {
  const { customization: { location_message }, setBanner, canCustomizeBanner } = useBanner();


  return (
    <div className="space-y-2">
      <input type="hidden" name="location_message" value={location_message} />
      <Input
        disabled={!canCustomizeBanner}
        id="location_message"
        placeholder={DEFAULT_MESSAGE}
        value={location_message}
        onChange={(e) => setBanner({ location_message: e.target.value })}
        maxLength={255}
      />
    </div>
  );
} 