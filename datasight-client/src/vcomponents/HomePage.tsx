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

