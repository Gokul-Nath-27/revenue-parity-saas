
import React from 'react';
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
      </div>
    </nav>
  );
};

export default Navbar;
