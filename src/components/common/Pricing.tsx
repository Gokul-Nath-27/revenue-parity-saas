import { Star, Check, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";

const PricingCard = ({
  title,
  price,
  frequency,
  description,
  features,
  buttonText,
  buttonVariant = "default",
  popular = false
}: {
  title: string;
  price: string;
  frequency: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary";
  popular?: boolean;
}) => (
  <Card className={`flex flex-col h-full border ${popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'} rounded-xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-5px]`}>
    {popular && (
      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          <span>POPULAR</span>
        </div>
      </div>
    )}

    <CardHeader className="pb-0">
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
      <CardDescription className="text-muted-foreground">{description}</CardDescription>
    </CardHeader>

    <CardContent className="pt-6 flex-grow">
      <div className="flex items-baseline mb-6">
        <span className="text-3xl md:text-4xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground ml-1">{frequency}</span>}
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
      <Button variant={buttonVariant} size="lg" className="w-full gap-2 font-medium">
        {buttonText} {buttonVariant === "default" && <ArrowRight className="h-4 w-4" />}
      </Button>
    </CardFooter>
  </Card>
);

export default function PricingSection() {
  return (
    <div id="pricing-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
      {/* Free Plan */}
      <PricingCard
        title="Starter"
        price="Free"
        frequency=""
        description="Perfect for trying out our platform"
        features={[
          "Up to 5,000 monthly visitors",
          "Basic banner customization",
          "Standard support",
          "Manual pricing control",
          "Single website integration"
        ]}
        buttonText="Start for Free"
        buttonVariant="outline"
      />

      {/* Pro Plan */}
      <PricingCard
        title="Professional"
        price="$20"
        frequency="/month"
        description="For growing businesses and creators"
        features={[
          "Up to 50,000 monthly visitors",
          "Advanced banner customization",
          "Priority email support",
          "A/B testing capabilities",
          "Multiple website integration",
          "Advanced analytics dashboard"
        ]}
        buttonText="Get Started"
        // popular={true}
      />

      {/* Enterprise Plan */}
      <PricingCard
        title="Enterprise"
        price="$60"
        frequency="/month"
        description="For large businesses with high volume"
        features={[
          "Unlimited monthly visitors",
          "Custom banner development",
          "24/7 dedicated support",
          "AI-powered price optimization",
          "Advanced revenue analytics",
          "Multi-team collaboration",
          "Custom integrations"
        ]}
        buttonText="Contact Sales"
        buttonVariant="secondary"
      />
    </div>

  )
}