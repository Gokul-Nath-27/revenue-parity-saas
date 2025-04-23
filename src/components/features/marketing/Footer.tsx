
import React from 'react';
import { GlobeIcon, Twitter, Instagram, Linkedin } from 'lucide-react';

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GlobeIcon className="h-5 w-5 text-primary" />
              <span className="font-bold text-xl">RevenueParity</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Helping digital creators maximize global revenue with smart pricing.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Testimonials', 'Case Studies', 'API'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'Guides', 'Blog', 'Support Center', 'Webinars'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {year} RevenueParity. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-white transition">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-white transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
