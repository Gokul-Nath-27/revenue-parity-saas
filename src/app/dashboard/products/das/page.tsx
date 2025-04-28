import { Settings, Palette } from 'lucide-react';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BannerPanel from '@/features/customization/components/BannerPannel';
import SiteConfigPanel from '@/features/customization/components/SiteConfigPannel';
import DiscountsPanel from '@/features/discounts/DiscountsPanel';

export default function ProductCustomizationTabs(): React.ReactNode {
  return (
    <Tabs defaultValue="banner" className="space-y-8">
      <TabsList className="bg-card/80 backdrop-blur-md border border-border/40 shadow-lg rounded-lg p-1 h-auto inline-flex w-full md:w-fit mb-3 mt-2 md:my-4">
        <TabsTrigger value="site" className="flex items-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
          <Settings className="h-4 w-4" />
          <span>Site Config</span>
        </TabsTrigger>
        <TabsTrigger value="banner" className="flex items-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
          <Palette className="h-4 w-4" />
          <span>Banner</span>
        </TabsTrigger>
        <TabsTrigger value="discounts" className="flex items-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
          <Palette className="h-4 w-4" />
          <span>Discounts</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="site" className="space-y-4">
        <SiteConfigPanel />
      </TabsContent>

      <TabsContent value="banner" className="space-y-4">
        <BannerPanel />
      </TabsContent>

      <TabsContent value="discounts" className="space-y-4">
        <DiscountsPanel />
      </TabsContent>
    </Tabs>
  )
} 