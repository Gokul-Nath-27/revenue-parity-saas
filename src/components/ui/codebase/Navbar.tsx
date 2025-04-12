
import React from 'react';
import { Button } from '@/components/ui/button';
import { GlobeIcon, Menu } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <GlobeIcon className="h-6 w-6 text-primary" />
          <Link href="/">
            <span className="font-bold text-xl">RevenueParity</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-white transition">Features</a>
          <a href="#setup" className="text-sm text-muted-foreground hover:text-white transition">How It Works</a>
          <a href="#banner" className="text-sm text-muted-foreground hover:text-white transition">Banner Builder</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-white transition">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
          </Link>
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
            Start Free
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
