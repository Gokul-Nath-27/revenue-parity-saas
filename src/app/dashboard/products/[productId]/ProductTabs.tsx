'use client';

import { Settings, Palette } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProductTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <TabsList className="bg-card/80 backdrop-blur-md border border-border/40 shadow-lg rounded-lg p-1 h-auto inline-flex w-full md:w-fit mb-3 mt-2 md:my-2">
      <TabsTrigger
        value="site"
        className="flex items-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
        onClick={() => handleTabChange('site')}
      >
        <Settings className="h-4 w-4" />
        <span>Site Config</span>
      </TabsTrigger>
      <TabsTrigger
        value="banner"
        className="flex items-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
        onClick={() => handleTabChange('banner')}
      >
        <Palette className="h-4 w-4" />
        <span>Banner</span>
      </TabsTrigger>
      <TabsTrigger
        value="discounts"
        className="flex items-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
        onClick={() => handleTabChange('discounts')}
      >
        <Palette className="h-4 w-4" />
        <span>Discounts</span>
      </TabsTrigger>
    </TabsList>
  );
} 