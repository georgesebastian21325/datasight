"use client";

import { useState, useEffect } from "react";
import Header from "../components/global/Header";
import Link from "next/link";
import SignOutModal from "../components/modal/SignOutModal"; // Import the SignOutModal component

import { handleSignOut } from "@/lib/cognitoActions";
import { Button } from "@/vcomponents/recommendations-components/button";

import LoadingPage from '../components/global/LoadingPage'

export default function HomePage() {
	const [currentTime, setCurrentTime] =
		useState<Date | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility state

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	};

	const [loading, setLoading] = useState(true); // Add loading state

	useEffect(() => {
		// Show the loading screen for 2 seconds
		const loadingTimer = setTimeout(() => {
			setLoading(false);
		}, 5000);

		return () => clearTimeout(loadingTimer);
	}, []);

	if (loading) return <LoadingPage />;

	return (
		<div className="mx-12 mt-10">

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
	);
}
