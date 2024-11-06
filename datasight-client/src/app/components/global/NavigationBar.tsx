'use client'

import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Header from './header'
import Link from "next/link";

import SignOutModal from "../modal/SignOutModal";
import { handleSignOut } from "@/lib/cognitoActions";
import { Button } from "@/vcomponents/recommendations-components/button"; 

import NavigationBarComponent from "@/vcomponents/NavigationBar";


export default function NavigationBar() {
    return (
            <NavigationBarComponent />

    )
}


{  /*          <nav className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <Header />
                </div>
                <Button onClick={() => setIsModalOpen(true)} variant="ghost" className='hover:bg-red-600 hover:text-white'>Sign Out</Button>
            </nav>
            <SignOutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close modal on cancel
                onSignOut={handleSignOut} // Handle sign-out logic
    /> */}