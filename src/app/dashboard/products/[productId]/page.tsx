import { ArrowLeft } from 'lucide-react';
import React, { Suspense } from 'react';
import Link from 'next/link';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import BannerPanel from '@/features/customization/components/BannerPannel';
import SiteConfigPanel from '@/features/customization/components/SiteConfigPannel';
import DiscountsPanel from '@/features/discounts/DiscountsPanel';
import { ProductCustomizationSkeleton } from '@/features/customization/components/product-customization-skeleton';
import { getProductDetails } from '@/features/products/db';
import { ProductTabs } from '@/app/dashboard/products/[productId]/ProductTabs';

type EditProductPageProps = {
  params: { productId: string };
  searchParams: { tab: string };
}

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const { productId } = await params;
  const { tab = "banner" } = await searchParams;

  return (
    <Tabs defaultValue={tab} className='relative'>
      <div className='flex items-center gap-2 st'>
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <ProductTabs />
      </div>
      <Suspense fallback={<ProductCustomizationSkeleton />}>
        <ProductCustomizationTabs productId={productId} />
      </Suspense>
    </Tabs>
  )
}

const ProductCustomizationTabs = async ({ productId }: { productId: string }) => {
  return (
    <>
      <TabsContent value="site" className="space-y-4">
        <SiteConfigPanel productId={productId} />
      </TabsContent>

      <TabsContent value="banner" className="space-y-4">
        <BannerPanel productId={productId} />
      </TabsContent>

      <TabsContent value="discounts" className="space-y-4">
        <DiscountsPanel productId={productId} />
      </TabsContent>
    </>
  )
} 
