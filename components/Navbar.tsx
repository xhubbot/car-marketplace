'use client';

import Link from 'next/link';
import { Car, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold tracking-tight">CarVista</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/browse" className="hover:text-blue-600 transition-colors">Browse Cars</Link>
            <Link href="/sell" className="hover:text-blue-600 transition-colors">Sell Car</Link>
            <Link href="/profile" className="hover:text-blue-600 transition-colors">My Profile</Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost">Login</Button>
            <Button>Sell Your Car</Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white py-4">
          <div className="px-6 flex flex-col gap-4 text-sm">
            <Link href="/" onClick={() => setIsOpen(false)} className="py-2">Home</Link>
            <Link href="/browse" onClick={() => setIsOpen(false)} className="py-2">Browse Cars</Link>
            <Link href="/sell" onClick={() => setIsOpen(false)} className="py-2">Sell Car</Link>
            <Link href="/profile" onClick={() => setIsOpen(false)} className="py-2">My Profile</Link>
            
            <div className="pt-4 border-t flex flex-col gap-3">
              <Button variant="outline" className="w-full">Login</Button>
              <Button className="w-full">Sell Your Car</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}