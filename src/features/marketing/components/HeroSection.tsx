import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import LinkStatus from '@/components/loading-indicator';
import { Button } from '@/components/ui/button';

import TiltCard from './TiltCard';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full border border-primary/10 bg-primary/5 text-sm text-primary">
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-primary"></span>
              Smart Pricing for Global Creators
            </div>

            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Boost Global Revenue<br />
              With Smart Pricing
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Automatically create parity-based discounts and coupons that make your
              digital products affordable worldwide without sacrificing your revenue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sign-up">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                  Start Free — No Credit Card <ArrowRight className="h-4 w-4" />
                  <LinkStatus className="spinner-dark-mode" />
                </Button>
              </Link>
              <Link href="#setup">
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-background"
                    >
                      <span className="text-xs">👤</span>
                    </div>
                  ))}
                </div>
                <p>Join <span className="text-foreground">2,000+</span> creators already using our platform</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <TiltCard>
              <div className="p-6 rounded-lg bg-secondary/50 border border-white/10 relative overflow-hidden">
                {/* Banner Preview */}
                <div className="w-full bg-gradient-to-r from-primary/20 to-blue-600/20 p-3 rounded-md mb-4 border border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-white/70">Based on your location</p>
                      <p className="text-sm font-semibold">30% OFF with code: <span className="text-primary">INDIA30</span></p>
                    </div>
                    <Button size="sm" variant="secondary" className="cursor-default">Apply</Button>
                  </div>
                </div>

                {/* Product Card Mock */}
                <div className="w-full bg-background rounded-lg p-4 border border-white/10">
                  <div className="relative aspect-video rounded-md mb-3 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-blue-600/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🎬</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent flex items-center gap-1">
                      <p className="text-xs text-white/80">Preview Available</p>
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold mb-1">Advanced Creator Course</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold">$49.99</span>
                    <span className="text-muted-foreground text-sm line-through">$79.99</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">30% OFF</span>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-default">Purchase Now</Button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/30 rounded-full blur-xl -z-1"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/30 rounded-full blur-xl -z-1"></div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
