
import { ArrowRight, Globe, Code, Settings, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import LinkStatus from '@/components/loading-indicator';
import { Button } from '@/components/ui/button';
const steps = [
  {
    icon: <Settings className="h-10 w-10 text-primary" />,
    title: "Enter Product Details",
    description: "Add your digital product information including pricing, currencies, and available regions.",
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Connect Your Domain",
    description: "Easily integrate with your existing website or storefront with our simple embed code.",
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: "Activate Global Pricing",
    description: "Turn on automatic regional pricing and watch your global sales increase instantly.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
    title: "Start Selling Globally",
    description: "Your products are now optimized for each market with fair, localized pricing.",
  }
];

const SetupFlowSection = () => {

  return (
    <section id="setup" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 z-0" />
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Set Up in Minutes, Sell Globally for Years
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our simple setup process gets you up and running with global pricing optimization in just a few minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-lg glass-morphism relative group hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary border border-white/10 z-10">
                <span className="text-sm font-bold">{index + 1}</span>
              </div>

              <div className="mb-4">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 rotate-0">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}

              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-lg transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/sign-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Now
              <LinkStatus className="spinner-dark-mode" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SetupFlowSection;
