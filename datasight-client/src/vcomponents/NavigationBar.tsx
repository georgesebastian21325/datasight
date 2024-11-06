'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from "@/vcomponents/navigation-bar-components/button";
import { Sheet, SheetContent, SheetTrigger } from "@/vcomponents/navigation-bar-components/sheet";
import Header from '@/app/components/global/header';
import { useRouter } from 'next/navigation';
import LoadingPage from '../app/components/global/LoadingPage';
import { useLoadingMessage } from "@/app/context/LoadingMessageContext";

export default function NavigationBar() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Ensure this line is present
  const { setMessage } = useLoadingMessage();

  const navItems = [
    { name: 'Resources', href: '/dashboard/resources', message: 'Loading Resource Dashboard...' },
    { name: 'Services', href: '/dashboard/services', message: 'Loading Service Dashboard...' },
    { name: 'Product', href: '/dashboard/products', message: 'Loading Product Dashboard...' },
    { name: 'Offering', href: '/dashboard/offerings', message: 'Loading Offering Dashboard...' },
    { name: 'Enterprise Architecture', href: '/enterprise-architecture', message: 'Loading Enterprise Architecture...' },
  ];

  // Navigation function with loading and custom message
  const navigateWithLoading = (path: string, message: string) => {
    setMessage(message);
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, 1500); // Optional delay for loading page visibility
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo placeholder */}
          <div className="flex-shrink-0 flex items-center">
            <Header />
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigateWithLoading(item.href, item.message)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 ease-in-out hover:scale-105"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Loading page */}
          {isLoading && <LoadingPage />}

          {/* Sign out button for desktop */}
          <div className="hidden sm:flex sm:items-center space-x-2">
            <Button variant="outline">Sign Out</Button>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <Sheet >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-gray-900 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-6 items-start ">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsOpen(false);
                        navigateWithLoading(item.href, item.message);
                      }}
                      className="px-3 py-2 rounded-md text-[0.8rem] text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 ease-in-out hover:scale-105"
                    >
                      {item.name}
                    </button>
                  ))}
                  <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full hover:bg-red-500 hover:text-white">
                    Sign Out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
