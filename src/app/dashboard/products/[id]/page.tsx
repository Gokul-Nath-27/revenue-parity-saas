import React, { Suspense } from 'react';

import ProductCustomizationTabs from './components/ProductCustomizationTabs';

export default function ProductPage(): React.ReactNode {
  return (
    <Suspense fallback={<div>Loading customization options...</div>}>
      <ProductCustomizationTabs />
    </Suspense>
  )
}


