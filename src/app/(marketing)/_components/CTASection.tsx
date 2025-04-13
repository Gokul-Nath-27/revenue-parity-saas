
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/95 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto glass-morphism border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

          <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />

          <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-4">
            Ready to Maximize Your Global Revenue?
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of creators who've increased their revenue by up to 40%
            with our intelligent pricing optimization.
          </p>

          <div className="bg-secondary/50 rounded-lg p-6 max-w-md mx-auto mb-8 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold">Start Free</div>
              <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Popular</div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <ul className="space-y-3 text-left mb-6">
              {[
                'Up to 5,000 monthly visitors',
                'Basic banner customization',
                'Standard support',
                'Manual pricing control'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 gap-2">
              Start Free – No Credit Card <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Need more? <a href="#" className="text-primary underline">View our paid plans</a> with
            advanced features, higher limits, and priority support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
