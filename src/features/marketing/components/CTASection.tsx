import { Sparkles } from 'lucide-react';
import React from 'react';

import PricingSection from '@/features/marketing/components/Pricing';

const CTASection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/95 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Choose the Right Plan for Your Business
          </h2>

          <p className="text-lg text-muted-foreground">
            Join thousands of creators who&apos;ve increased their revenue by up to 40%
            with our intelligent pricing optimization.
          </p>
        </div>
        <PricingSection />
        <div className="mt-12 text-center max-w-xl mx-auto">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required to get started.
            Need a custom solution? <a href="#" className="text-primary underline hover:text-primary/80 transition-colors">Contact our sales team</a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
