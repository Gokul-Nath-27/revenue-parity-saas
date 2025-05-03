import { Check } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { subscriptionTiersInOrder } from "@/data/subscriptionTiers";
import { getUser , getSessionIdFromCookie } from "@/lib/session";

import { getUserSubscriptionTier } from "../db";



export default async function PricingSection() {
  const { id } = await getUser(await getSessionIdFromCookie() || "")
  const currentTier = await getUserSubscriptionTier(id)
  return (
    <div id="pricing-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {subscriptionTiersInOrder.map((tier) => (
        <PricingCard
          key={tier.name}
          title={tier.name}
          price={tier.priceInCents === 0 ? "Free" : `$${(tier.priceInCents / 100).toFixed(2)}`}
          description={tier.description}
          features={tier.features}
          buttonText={tier.subscriptionLayout.buttonText}
          currentTier={currentTier.name}
        />
      ))}
    </div>
  );
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  currentTier,
}: {
  title: string;
  price: string;
  description: string;
  features: readonly string[];
  buttonText: string;
  currentTier: string;
}) => {
  const isCurrentTier = currentTier === title
  return (
    <Card className={`flex flex-col h-full border border-border rounded-xl relative overflow-hidde`}>
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 flex-grow">
        <div className="flex items-baseline mb-6">
          <span className="text-3xl md:text-4xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-muted-foreground ml-1">/month</span>}
        </div>

        <ul className="space-y-3 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-4">
        <Button size="lg" className="w-full gap-2 font-medium" variant={isCurrentTier ? "outline" : "default"}>
          {isCurrentTier ? "Current Subscription" : buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

