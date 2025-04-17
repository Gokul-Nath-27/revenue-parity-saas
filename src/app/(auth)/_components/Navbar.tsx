
import React from 'react';
import Logo from '@/Icons/Logo';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Logo to="/" />
      </div>
    </nav>
  );
};

export default Navbar;
