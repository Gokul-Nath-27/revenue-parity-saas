"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/assets/Icons/Logo';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-white/10">
      {/* Hidden checkbox for toggle state */}
      <input type="checkbox" id="menu-toggle" className="hidden peer" />

      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Logo to="/" />

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-white transition">Features</a>
          <a href="#setup" className="text-sm text-muted-foreground hover:text-white transition">How It Works</a>
          <a href="#banner" className="text-sm text-muted-foreground hover:text-white transition">Banner Builder</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-white transition">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden md:block">
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          </Link>


          {/* Label for menu toggle with proper icon visibility control */}
          <label htmlFor="menu-toggle" className="md:hidden cursor-pointer relative w-5 h-5">
            <Menu className="absolute inset-0 transition-all duration-300 peer-checked:opacity-0 peer-checked:scale-0" />
            <X className="absolute inset-0 transition-all duration-300 opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100" />
          </label>

        </div>
      </div>

      {/* Mobile menu that responds to checkbox state */}
      <div className="mobile-menu md:hidden">
        <div className="container border-t px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <Link href="#features" className="text-sm font-medium text-foreground transition-colors">
              Features
            </Link>
            <Link
              href="#setup"
              className="text-sm font-medium text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#banner" className="text-sm font-medium text-foreground transition-colors">
              Banner Builder
            </Link>
          </nav>
          <div className="mt-4">
            <Link href="/sign-in">
              <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;