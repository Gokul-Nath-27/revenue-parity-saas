"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Text, LayoutGrid, SlidersHorizontal, CircleUser, Plus } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const BannerBuilderSection = () => {
  const [bannerColor, setBannerColor] = useState('from-primary/20 to-blue-600/20');
  const [bannerStyle, setBannerStyle] = useState('rounded-md');
  const [customColors, setCustomColors] = useState<string[]>([]);

  const colors = [
    'from-primary/20 to-blue-600/20',
    'from-purple-600/20 to-pink-600/20',
    'from-blue-600/20 to-cyan-600/20',
    'from-emerald-600/20 to-yellow-600/20'
  ];

  const styles = [
    'rounded-md',
    'rounded-xl',
    'rounded-none'
  ];

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Create a gradient with the selected color
    const newColor = `from-${e.target.value.replace('#', '')}/20 to-blue-600/20`;
    setBannerColor(newColor);
  };

  const addCustomColor = () => {
    if (bannerColor && !colors.includes(bannerColor) && !customColors.includes(bannerColor)) {
      setCustomColors([...customColors, bannerColor]);
    }
  };

  return (
    <section id="banner" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 z-0" />
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Custom Banner Builder
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, on-brand promotional banners that boost sales
            while perfectly matching your website's design.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="space-y-6">
              <Card className="p-6 glass-morphism border border-white/10">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <CircleUser className="h-5 w-5 text-primary" />
                  Completely Customizable
                </h3>
                <p className="text-muted-foreground mb-4">
                  Adjust colors, fonts, and styles to match your brand perfectly.
                  Your banners will look like they were custom designed for your site.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Banner Color</label>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {colors.map((color, i) => (
                        <button
                          key={i}
                          className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} ${bannerColor === color ? 'ring-2 ring-white' : 'ring-1 ring-white/20'}`}
                          onClick={() => setBannerColor(color)}
                        />
                      ))}

                      {customColors.map((color, i) => (
                        <button
                          key={`custom-${i}`}
                          className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} ${bannerColor === color ? 'ring-2 ring-white' : 'ring-1 ring-white/20'}`}
                          onClick={() => setBannerColor(color)}
                        />
                      ))}

                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center ring-1 ring-white/20 hover:bg-secondary/80 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-white" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-popover p-4">
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm">Custom Colors</h4>
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Select a color:</p>
                              <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-5 gap-2">
                                  {[
                                    "#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981",
                                    "#6366F1", "#EC4899", "#EF4444", "#06B6D4", "#84CC16",
                                    "#8D5CF7", "#14B8A6", "#F59E0B", "#64748B", "#9333EA"
                                  ].map((color) => (
                                    <button
                                      key={color}
                                      className={cn(
                                        "w-8 h-8 rounded-full",
                                        bannerColor === `from-${color.replace('#', '')}/20 to-blue-600/20`
                                          ? "ring-2 ring-white"
                                          : "ring-1 ring-white/20"
                                      )}
                                      style={{ backgroundColor: color }}
                                      onClick={() => setBannerColor(`from-${color.replace('#', '')}/20 to-blue-600/20`)}
                                    />
                                  ))}
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    className="w-8 h-8 rounded overflow-hidden cursor-pointer bg-transparent"
                                    onChange={handleColorChange}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Choose a custom color
                                  </p>
                                </div>

                                <Button size="sm" onClick={addCustomColor}>
                                  Save Custom Color
                                </Button>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Banner Style</label>
                    <div className="flex items-center gap-2 mt-2">
                      {styles.map((style, i) => (
                        <button
                          key={i}
                          className={`px-3 py-1 border ${bannerStyle === style ? 'border-white bg-white/10' : 'border-white/20'} ${style}`}
                          onClick={() => setBannerStyle(style)}
                        >
                          {style.replace('rounded-', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 glass-morphism border border-white/10">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-primary" />
                  Smart Country Detection
                </h3>
                <p className="text-muted-foreground">
                  Our system automatically detects visitor location and displays
                  personalized pricing in their local currency with appropriate discounts.
                </p>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="sticky top-24">
              <div className="relative mx-auto max-w-2xl overflow-hidden rounded-lg bg-secondary/20 p-8 border border-white/10">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-blue-500/20 rounded-full blur-xl"></div>

                {/* Mock Website Header */}
                <div className="w-full flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/80"></div>
                    <div className="h-3 w-24 bg-white/20 rounded"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-12 bg-white/20 rounded"></div>
                    <div className="h-2 w-12 bg-white/20 rounded"></div>
                    <div className="h-2 w-12 bg-white/20 rounded"></div>
                  </div>
                </div>

                {/* Banner Preview */}
                <div className={`w-full bg-gradient-to-r ${bannerColor} p-3 ${bannerStyle} mb-6 border border-white/10 relative`}>
                  <div className="absolute top-2 right-2">
                    <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center text-[8px]">
                      ✕
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-white/70">Based on your location (India)</p>
                      <p className="text-sm font-semibold">30% OFF with code: <span className="text-primary">INDIA30</span></p>
                    </div>
                    <Button size="sm" variant="secondary">Apply</Button>
                  </div>
                </div>

                {/* Mock Content */}
                <div className="w-full mb-6">
                  <div className="h-8 w-3/4 bg-white/10 rounded mb-3"></div>
                  <div className="h-4 w-full bg-white/5 rounded mb-2"></div>
                  <div className="h-4 w-full bg-white/5 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-white/5 rounded mb-6"></div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video bg-white/5 rounded"></div>
                    <div className="aspect-video bg-white/5 rounded"></div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> Customize Banner
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerBuilderSection;
