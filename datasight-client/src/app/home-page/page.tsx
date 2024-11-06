"use client";

import { useState, useEffect } from "react";

import LoadingPage from '../components/global/LoadingPage'
import HomePage from '../../vcomponents/HomePage'

export default function page() {
	const [loading, setLoading] = useState(true); 

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
			<HomePage />
		</>
	);
}
