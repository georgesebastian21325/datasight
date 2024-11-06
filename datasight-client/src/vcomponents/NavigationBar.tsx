'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from "@/vcomponents/navigation-bar-components/button";
import { Sheet, SheetContent, SheetTrigger } from "@/vcomponents/navigation-bar-components/sheet";

import Header from '@/app/components/global/header';
import SignOutModal from '@/app/components/modal/SignOutModal';
import LoadingPage from './LoadingPage';

import { useLoadingMessage } from "@/app/context/LoadingMessageContext";
import { handleSignOut } from '@/lib/cognitoActions';


export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setMessage } = useLoadingMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { name: 'Resources', href: '/dashboard/resources', message: 'Loading Resource Dashboard...' },
    { name: 'Services', href: '/dashboard/services', message: 'Loading Service Dashboard...' },
    { name: 'Products', href: '/dashboard/products', message: 'Loading Product Dashboard...' },
    { name: 'Offerings', href: '/dashboard/offerings', message: 'Loading Offering Dashboard...' },
    { name: 'Enterprise Architecture', href: '/enterprise-architecture', message: 'Loading Enterprise Architecture...' },
  ];

  // Redirect to resource dashboard as the default page
  useEffect(() => {
    if (pathname === '/') {
      setMessage('Loading Resource Dashboard...');
      setIsLoading(true);
      setTimeout(() => {
        router.push('/dashboard/resources');
        setIsLoading(false);
      }, 3000); // Delay for loading page visibility
    }
  }, [pathname, router, setMessage]);

  // Navigation function with loading and custom message
  const navigateWithLoading = (path: string, message: string) => {
    setMessage(message);
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, 10000); // Delay for loading page visibility
  };

  // If loading, show the loading page instead of the navigation bar
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <nav className="mt-5 shadow-lg mb-12 rounded-xl lg:mx-[9rem]">
      <div className="max-w-[91rem] mx-auto px-4 sm:px-6 lg:px-8">
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
                className="px-3 py-2 rounded-md text-sm font-medium  hover:text-white hover:bg-black transition-all duration-200 ease-in-out hover:scale-105"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Sign out button for desktop */}
          <div className="hidden sm:flex sm:items-center space-x-2">
            <Button onClick={() => setIsModalOpen(true)}  variant="outline">Sign Out</Button>
          </div>
          <SignOutModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)} // Close modal on cancel
            onSignOut={handleSignOut} // Handle sign-out logic
          /> 
          {/* Mobile menu button */}
          <div className=" sm:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-gray-900 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[500px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-6 items-start">
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
                  <Button variant="outline" onClick={() => setIsOpen(false)} className=" hover:bg-red-500 hover:text-white">
                    Sign Out
                  </Button>
                  <SignOutModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)} // Close modal on cancel
                    onSignOut={handleSignOut} // Handle sign-out logic
                  />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
