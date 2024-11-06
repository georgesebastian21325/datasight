'use client'

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/vcomponents/home-page-components/button";
import { useRouter } from 'next/navigation';
import NavigationBar from '../app/components/global/NavigationBar';
import LoadingPage from '../app/components/global/LoadingPage';
import BackgroundImage from '../assets/background-image.jpg';
import { useLoadingMessage } from "@/app/context/LoadingMessageContext";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setMessage } = useLoadingMessage();

  // Navigation functions with loading and custom message
  const navigateWithLoading = (path: string, message: string) => {
    setMessage(message);
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, 15000); // Optional delay for loading page visibility
  };

  return (
    <div className="min-h-screen bg-cover bg-center">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10 opacity-50"
      ></div>
      {isLoading ? (
        <LoadingPage /> // Show LoadingPage while loading
      ) : (
        <main className='relative z-10 flex flex-col text-center'>
            <NavigationBar />
        </main>
      )}
    </div>
  );
}


{/* <section className="py-24">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]">
                Welcome to Data Sight
              </h1>
              <p className="text-xl text-center mb-12 text-gray-600">
                Transform your insights and empower the future with our tool.
              </p>
              <div className='w-full max-w-4xl mx-auto space-y-4'>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Link href='/dashboard/resources' >
                    <Button
                      onClick={() => navigateWithLoading('/dashboard/resources', 'Loading Resource Dashboard...')}
                      className="md:w-full w-[40%] hover:bg-gray-800 hover:shadow-xl "
                      size="lg"
                    >
                      Resource Dashboard
                    </Button>
                  </Link>
                  <Link href='/dashboard/products' >
                    <Button
                      onClick={() => navigateWithLoading('/dashboard/products', 'Loading Product Dashboard...')}
                      className="md:w-full hover:bg-gray-800 hover:shadow-xl"
                      size="lg"
                    >
                      Product Dashboard
                    </Button>
                  </Link>
                  <Link href='/dashboard/services' >
                    <Button
                      onClick={() => navigateWithLoading('/dashboard/services', 'Loading Service Dashboard...')}
                      className="md:w-full hover:bg-gray-800 hover:shadow-xl"
                      size="lg"
                    >
                      Service Dashboard
                    </Button>
                  </Link>
                  <Link href='/dashboard/offerings' >
                    <Button
                      onClick={() => navigateWithLoading('/dashboard/offerings', 'Loading Offering Dashboard...')}
                      className="md:w-full hover:bg-gray-800 hover:shadow-xl"
                      size="lg"
                    >
                      Offering Dashboard
                    </Button>
                  </Link>
                </div>
                  <div className='flex justify-center'>
                    <Link href='/enterprise-architecture-view' >
                      <Button
                        onClick={() => navigateWithLoading('/enterprise-architecture-view', 'Loading Enterprise Architecture...')}
                        className="md:w-full w-[90%] text-[0.9rem] bg-brand-blue hover:bg-blue-800"
                        size="lg"
                      >
                        Enterprise Architecture
                      </Button>
                    </Link>
                  </div>
              </div>
            </div>
          </section> */}