"use client";

import { useState, useEffect } from "react";
import Header from "../components/global/Header";
import Link from "next/link";
import SignOutModal from "../components/modal/SignOutModal"; // Import the SignOutModal component

import { handleSignOut } from "@/lib/cognitoActions";
import { getCurrentUser } from "aws-amplify/auth";

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

	return (
		<div className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
			<div className="w-full text-right mb-4">
				{currentTime && (
					<p
						className="text-xl font-semibold text-gray-700"
						aria-live="polite"
					>
						{formatTime(currentTime)}
					</p>
				)}
			</div>
			<div className="text-center mb-8">
				<Header />
			</div>

			<div className="text-center mb-8 p-6 border-2 border-gray-300 rounded-lg shadow-md">
				<h2 className="text-2xl font-semibold text-gray-700 mb-2">
					Welcome George, how can we help you today?
				</h2>
				<p className="text-gray-600 mb-6">
					Manage your enterprise architecture with ease.
				</p>

				<div className="flex flex-wrap justify-center gap-4">
					{[
						{
							label: "Enterprise Architecture",
							href: "/enterprise-architecture-view",
						},
						{ label: "Settings", href: "/settings" },
					].map(({ label, href }) => (
						<Link
							key={label}
							href={href}
						>
							<button className="bg-[#000080] text-white font-medium px-4 py-2 rounded-md w-[250px] transition-transform transform hover:scale-105 hover:bg-black">
								{label}
							</button>
						</Link>
					))}

					{/* Sign Out button */}
					<button
						onClick={() => setIsModalOpen(true)} // Open the modal on click
						className="bg-[#000080] text-white font-medium px-4 py-2 rounded-md w-[250px] transition-transform transform hover:scale-105 hover:bg-red-600"
					>
						Sign Out
					</button>
				</div>
			</div>

			{/* Sign Out Modal */}
			<SignOutModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)} // Close modal on cancel
				onSignOut={handleSignOut} // Handle sign-out logic
			/>
		</div>
	);
}
