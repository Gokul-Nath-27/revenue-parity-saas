import { Check } from "lucide-react";
import { Suspense } from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { subscriptionTiersInOrder } from "@/data/subscriptionTiers";

import UpgradeCheckoutWrapper from "./UpgradeCheckoutWrapper";

export default async function PricingGroup() {
  return (
    <div id="pricing-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {subscriptionTiersInOrder.map((tierConfig, index) => {
        const { name: tier, priceInDollars, description, features } = tierConfig;
        return (
          <Card
            className={`flex flex-col h-full border border-border rounded-xl relative overflow-hidden`}
            key={tier}
          >
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {tier}
              </CardTitle>
              <CardDescription className="text-muted-foreground">{description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-2 flex-grow">
              <div className="flex items-baseline mb-6">
                <span className="text-3xl md:text-4xl font-bold">{priceInDollars === 0 ? "Free" : `$${priceInDollars}`}</span>
                {priceInDollars !== 0 && <span className="text-muted-foreground ml-1">/month</span>}
              </div>

              <ul className="space-y-3 text-sm">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-4">
              <Suspense fallback={<Skeleton className="w-full h-12" />}>
                <UpgradeCheckoutWrapper tier={tier} />
              </Suspense>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}