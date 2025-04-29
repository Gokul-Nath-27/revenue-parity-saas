"use client"
import { Input } from '@/components/ui/input';

import { useBanner } from './BannerContext';

const MAX_MESSAGE_LENGTH = 200;
const DEFAULT_MESSAGE = "Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>{coupon}</b> to get <b>{discount}%</b> off.";

export function BannerMessageInput() {
  const { customMessage, setCustomMessage } = useBanner();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setCustomMessage(value);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        id="customMessage"
        placeholder={DEFAULT_MESSAGE}
        value={customMessage}
        onChange={handleChange}
        maxLength={MAX_MESSAGE_LENGTH}
      />
    </div>
  );
} 