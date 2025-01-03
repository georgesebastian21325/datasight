"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import LoginForm from "./forms/login-form";
import CompanyLogo from '../assets/company-logo.jpg';

import LoginAsset from '../assets/login-asset-2.png';
import { Card } from "@/vcomponents/onboarding-components/card";
import LoadingPage from './components/global/LoadingPage' // Import your loading page component

import { useLoadingMessage } from "./context/LoadingMessageContext";

const phrases = [
	"Transform data into insights.",
	"Bring strategy to life.",
	"Map out your data strategy. "
];

function LoginPage() {
	const [currentText, setCurrentText] = useState('');
	const [index, setIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);
	const [delay, setDelay] = useState(150);
	const [loading, setLoading] = useState(true); // Add loading state

	const { setMessage } = useLoadingMessage();

	useEffect(() => {
		setMessage('System Loading...');
	}, [setMessage]);

	useEffect(() => {
		// Show the loading screen for 2 seconds
		const loadingTimer = setTimeout(() => {
			setLoading(false);
		}, 5000);

		return () => clearTimeout(loadingTimer);
	}, []);

	useEffect(() => {
		if (loading) return; // Skip the typing effect if loading

		const handleTyping = () => {
			const currentPhrase = phrases[index];

			if (!isDeleting && charIndex < currentPhrase.length) {
				setCurrentText(prev => prev + currentPhrase.charAt(charIndex));
				setCharIndex(prev => prev + 1);
				setDelay(100);
			} else if (isDeleting && charIndex > 0) {
				setCurrentText(prev => prev.slice(0, -1));
				setCharIndex(prev => prev - 1);
				setDelay(75);
			} else if (!isDeleting && charIndex === currentPhrase.length) {
				setIsDeleting(true);
				setDelay(1000);
			} else if (isDeleting && charIndex === 0) {
				setIsDeleting(false);
				setIndex((prev) => (prev + 1) % phrases.length);
				setDelay(500);
			}
		};

		const timer = setTimeout(handleTyping, delay);
		return () => clearTimeout(timer);
	}, [charIndex, isDeleting, index, delay, loading]);

	// Show loading screen if loading is true
	if (loading) return <LoadingPage />;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
			<div className="flex items-center justify-center">
				<div className="w-full max-w-md flex flex-col items-center">
					<div className="mb-12">
						<Image src={CompanyLogo} alt="company_logo" height={50} />
					</div>
					<div className="flex text-center mb-6">
						<h1 className="text-4xl md:text-5xl font-serif w-[50rem]" style={{ minHeight: '60px' }}>
							{currentText}
						</h1>
					</div>
					<Card>
						<LoginForm />
					</Card>
				</div>
			</div>
			<div className="lg:flex items-center justify-center shadow-md bg-gradient-to-br from-black to-brand-blue rounded-tl-2xl rounded-bl-2xl hidden">
				<div className='ml-5 hidden md:block'>
					<Image src={LoginAsset} alt='login-asset' width={700} />
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
