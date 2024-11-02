'use client'

import { useState } from "react";
import { Button } from "@/vcomponents/home-page-components/button";
import { useRouter } from 'next/navigation';

import NavigationBar from '../app/components/global/NavigationBar'
import LoadingPage from '../app/components/global/LoadingPage'

import BackgroundImage from '../assets/background-image.jpg'


export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Navigation functions with loading
  const navigateWithLoading = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, 5000); // Optional delay for loading page visibility
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center -z-10 opacity-50"
        style={{ backgroundImage: `url(${BackgroundImage.src})` }}
      ></div>
      {isLoading ? (
        <LoadingPage /> // Show LoadingPage while loading
      ) : (
        <main>
          <NavigationBar />
          <section className="py-24">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]">
                Welcome to Data Sight
              </h1>
              <p className="text-xl text-center mb-12 text-gray-600">
                Transform your insights and empower the future with our tool.
              </p>

              {/* Navigation Buttons */}
              <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
                <Button onClick={() => navigateWithLoading('/dashboard/resources')} className="w-full hover:bg-gray-900 hover:shadow-xl" size="lg">
                  Resource
                </Button>
                  <Button onClick={() => navigateWithLoading('/dashboard/products')} className="w-full hover:bg-gray-900 hover:shadow-xl" size="lg">
                  Product
                </Button>
                  <Button onClick={() => navigateWithLoading('/dashboard/services')} className="w-full hover:bg-gray-900 hover:shadow-xl" size="lg">
                  Service
                </Button>
                  <Button onClick={() => navigateWithLoading('/dashboard/offerings')} className="w-full hover:bg-gray-900 hover:shadow-xl" size="lg">
                  Offering
                </Button>
              </div>

              <div className="flex justify-center mt-5">
                  <Button onClick={() => navigateWithLoading('/enterprise-architecture-view')} className="w-full max-w-[15rem] bg-brand-blue hover:bg-blue-800 hover:shadow-xl" size="lg">
                  Enterprise Architecture
                </Button>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
