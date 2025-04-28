"use client"
import { Input } from '@/components/ui/input';

import { useBanner } from './BannerContext';

export function BannerMessageInput() {
  const { customMessage, setCustomMessage } = useBanner();

  return (
    <>
      <Input
        id="customMessage"
        placeholder="Special offer for visitors from your country!"
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
      />
    </>
  );
} 