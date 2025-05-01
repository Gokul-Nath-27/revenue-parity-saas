import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';

import { ProductTabs } from '@/app/dashboard/products/[productId]/ProductTabs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ParityGroupFormWrapper from '@/features/discounts/components/ParityGroupFormWrapper';
import SiteConfigPanel from '@/features/products/components/EditProduct/SiteConfigPannel';
import { ProductCustomizationSkeleton } from '@/features/products/components/product-customization-skeleton';

type EditProductPageProps = {
  params: { productId: string };
  searchParams: { tab: string };
}
const tabHeadingConfig = {
  site: {
    heading: "Site Configuration",
    description: "Configure your site settings"
  },
  banner: {
    heading: "Banner Configuration",
    description: "Configure your banner settings"
  },
  discounts: {
    heading: "Discounts Configuration",
    description: "Both the discount percentage and coupon code need to be filled if you want to display deals for any specific parity group."
  }
}

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const { productId } = await params;
  const { tab = "banner" } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs defaultValue={tab} className='relative'>
        <div className='flex items-center gap-2 st'>
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <ProductTabs />
        </div>

        <TabsContent value="site" className="space-y-4">
          <TabHeadingWrapper headers={tabHeadingConfig.site}>
            <Suspense fallback={<ProductCustomizationSkeleton />}>
              <SiteConfigPanel productId={productId} />
            </Suspense>
          </TabHeadingWrapper>
        </TabsContent>
        {/* <TabsContent value="banner" className="space-y-4">
          <TabHeadingWrapper headers={tabHeadingConfig.banner}>
            <Suspense fallback={<ProductCustomizationSkeleton />}>
              <BannerPannel productId={productId} />
            </Suspense>
          </TabHeadingWrapper>
        </TabsContent> */}

        <TabsContent value="discounts" className="space-y-4">
          <TabHeadingWrapper headers={tabHeadingConfig.discounts}>
            <Suspense fallback={<div>Loading...</div>}>
              <ParityGroupFormWrapper productId={productId} />
            </Suspense>
          </TabHeadingWrapper>
        </TabsContent>
      </Tabs>
    </Suspense>
  )
}

const TabHeadingWrapper = ({ children, headers }: { children: React.ReactElement, headers: { heading: string, description: string } }) => {
  const { heading, description } = headers;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{heading}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}
