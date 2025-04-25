import { Settings, Palette } from 'lucide-react';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BannerPanel from '@/features/Customization/components/BannerPannel';
import SiteConfigPanel from '@/features/Customization/components/SiteConfigPannel';

export default function ProductCustomizationTabs(): React.ReactNode {
  return (
    <Tabs defaultValue="banner" className="space-y-8">
      <TabsList className="md:grid-cols-5 bg-muted p-1 h-auto">
        <TabsTrigger value="site" className="flex items-center gap-2 py-3">
          <Settings className="h-4 w-4" />
          <span className="hidden md:inline">Site Config</span>
        </TabsTrigger>
        <TabsTrigger value="banner" className="flex items-center gap-2 py-3">
          <Palette className="h-4 w-4" />
          <span className="hidden md:inline">Banner</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="site" className="space-y-4">
        <SiteConfigPanel />
      </TabsContent>

      <TabsContent value="banner" className="space-y-4">
        <BannerPanel />
      </TabsContent>
    </Tabs>
  )
} 