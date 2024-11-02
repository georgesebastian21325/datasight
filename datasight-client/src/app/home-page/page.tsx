"use client";

import { useState, useEffect } from "react";

import LoadingPage from '../components/global/LoadingPage'

import NavigationBar from "../components/global/NavigationBar";
import BodySection from '../../vcomponents/home-page'

export default function HomePage() {


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
		<>
			<NavigationBar />
			<BodySection />
		</>
	);
}
