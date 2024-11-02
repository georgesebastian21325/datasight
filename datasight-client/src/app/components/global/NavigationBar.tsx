'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';

import Header from './header';
import SignOutModal from "../modal/SignOutModal";
import { handleSignOut } from "@/lib/cognitoActions";
import { Button } from "@/vcomponents/recommendations-components/button";
import { useLoadingMessage } from '@/app/context/LoadingMessageContext';

export default function NavigationBar() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility state
    const { setMessage } = useLoadingMessage(); // Use loading message context
    const router = useRouter();

    const openSignOutModal = () => {
        setMessage("Signing Out..."); // Set loading message
        setIsModalOpen(true); // Open modal
    };

    const handleSignOutAndRedirect = async () => {
        await handleSignOut(); // Handle the sign-out logic
        setIsModalOpen(false); // Close modal after sign-out
        router.push('/'); // Redirect to the home page
    };

    return (
        <div className="mx-[8.5rem] mt-10">
            <nav className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <Header />
                </div>
                <Button onClick={openSignOutModal} variant="ghost" className='hover:bg-red-600 hover:text-white'>
                    Sign Out
                </Button>
            </nav>
            <SignOutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close modal on cancel
                onSignOut={handleSignOutAndRedirect} // Custom sign-out function
            />
        </div>
    );
}
