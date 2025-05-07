'use client';

import { useLinkStatus } from 'next/link';

import { cn } from '@/lib/utils';

export default function LinkStatus({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  return pending ? (
    <div
      role="status"
      aria-label="Loading"
      className={cn("spinner ml-1 size-4 shrink-0 rounded-full", className)}
    />
  ) : null;
}