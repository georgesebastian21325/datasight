'use client'

import { useState, useEffect } from "react";
import Header from '../../components/global/Header';
import Link from "next/link";

import SignOutModal from "../modal/SignOutModal";
import { handleSignOut } from "@/lib/cognitoActions";
import { Button } from "@/vcomponents/recommendations-components/button"; 


export default function NavigationBar() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility state


    return (
        <div className="mx-[8.5rem] mt-10">
            <nav className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <Header />
                </div>
                <div className="flex gap-4">
                    <Link href='/enterprise-architecture-view'>
                        <Button variant="ghost">  ENTERPRISE ARCHITECTURE   </Button>
                    </Link>
                    <Button variant="ghost">SETTINGS</Button>
                </div>
                <Button onClick={() => setIsModalOpen(true)} variant="ghost">SIGN OUT</Button>
            </nav>
            <SignOutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close modal on cancel
                onSignOut={handleSignOut} // Handle sign-out logic
            />
        </div>
    )
}
