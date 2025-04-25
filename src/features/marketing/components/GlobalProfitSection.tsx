import { Globe, TrendingUp, Banknote, CheckCircle } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

const chartData = (() => Array.from({ length: 30 }).map(() => 20 + Math.random() * 80))();
const stats = [
  { value: '40%', label: 'Average Revenue Increase' },
  { value: '120+', label: 'Supported Countries' },
  { value: '90%', label: 'Customer Satisfaction' },
  { value: '3x', label: 'Conversion Improvement' },
];
const features = [
  {
    title: 'Automatic Currency Detection',
    description: 'Instantly identifies visitor location and displays prices in their local currency.',
    icon: <Globe className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Purchasing Power Parity',
    description: 'Adjusts prices based on local economic conditions, making your products affordable everywhere.',
    icon: <Banknote className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Revenue Optimization',
    description: 'Smart algorithms ensure you maximize sales without sacrificing profit margins.',
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
  },
];

const GlobalProfitSection = () => {

  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 z-0" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Maximize Global Revenue & Reach
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn international visitors into paying customers with intelligent
            pricing that respects local economies while maximizing your earnings.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-lg glass-morphism text-center group hover:border-primary/30 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gradient-primary group-hover:text-white transition-colors duration-300">
                {stat.value}
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              <h3 className="text-xl font-semibold">Who benefits the most:</h3>
              <ul className="space-y-3">
                {[
                  'Online course creators with global audiences',
                  'Digital product sellers targeting international markets',
                  'SaaS companies looking to expand globally',
                  'Content creators monetizing through digital downloads'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Maximizing Revenue
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-blue-500/20 rounded-full blur-xl"></div>

            <div className="relative border border-white/10 rounded-lg p-6 glass-morphism animate-float">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Global Revenue Dashboard</h3>
                <p className="text-sm text-muted-foreground">Last 30 days performance</p>
              </div>

              {/* Mock Chart */}
              <div className="h-64 mb-6 bg-secondary/30 rounded-lg border border-white/5 p-4">
                <div className="flex justify-between mb-2">
                  <div className="text-xs text-muted-foreground">Revenue</div>
                  <div className="text-xs text-muted-foreground">+24.3%</div>
                </div>

                <div className="h-40 w-full flex items-end gap-1">
                  {chartData.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary/50 to-primary/20"
                      style={{
                        height: `${height}%`,
                        opacity: i === 24 ? 1 : 0.7
                      }}
                    ></div>
                  ))}
                </div>

                <div className="flex justify-between mt-2">
                  <div className="text-xs text-muted-foreground">Apr 1</div>
                  <div className="text-xs text-muted-foreground">Apr 30</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-secondary/30 border border-white/5">
                  <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                  <div className="text-2xl font-semibold">$12,845</div>
                  <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +32.5% vs previous
                  </div>
                </div>

                <div className="p-4 rounded-md bg-secondary/30 border border-white/5">
                  <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                  <div className="text-2xl font-semibold">4.7%</div>
                  <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +1.2% vs previous
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalProfitSection;
