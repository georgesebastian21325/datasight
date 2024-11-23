"use client";
import React, { useState, useEffect } from "react";
import { CircleX, Loader } from "lucide-react";

interface OptimizedOPSRMappingProps {
	optimizationType: string;
}

export default function AIPresenter({
	optimizationType,
}: OptimizedOPSRMappingProps) {
	const [text, setText] = useState<string | JSX.Element[]>(
		"",
	); // State to store the fetched text
	const [loading, setLoading] = useState<Boolean>(false); // State to handle loading status
	const [error, setError] = useState<string | null>(null); // State to handle errors
	const [videoUrl, setVideoUrl] = useState<string | null>(
		null,
	); // State to store the generated video URL
	const [showVideo, setShowVideo] = useState(false);
	const API_KEY =
		"anVkZ2UubW9uZ2NhbC5jaWNzQHVzdC5lZHUucGg:o7TU4ENjRnOh689pHzlx2";

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null);
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [error]);

	// Function to generate a video with D-ID API
	const generateVideo = async (text: string) => {
		if (!text) {
			setError(
				"No text available for generating the video.",
			);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// Step 1: Create the talk
			const createResponse = await fetch(
				"https://api.d-id.com/talks",
				{
					method: "POST",
					headers: {
						Authorization: `Basic ${API_KEY}`,
						"Content-Type": "application/json", // Added this header
					},
					body: JSON.stringify({
						script: {
							type: "text",
							input: text,
							provider: {
								type: "microsoft",
								voice_id: "en-US-SaraNeural", // Fixed voice ID
							},
						},
						config: {
							stitch: true,
						},
						source_url:
							"https://img.freepik.com/premium-photo/free-photo-business-finance-employment-female_837074-7695.jpg",
					}),
				},
			);

			if (!createResponse.ok) {
				const errorData = await createResponse.json();
				throw new Error(
					`Failed to create talk: ${
						errorData.message || createResponse.statusText
					}`,
				);
			}

			const createData = await createResponse.json();
			const talkId = createData.id;

			// Step 2: Poll for the result
			let result;
			while (true) {
				const resultResponse = await fetch(
					`https://api.d-id.com/talks/${talkId}`,
					{
						headers: {
							Authorization: `Basic ${API_KEY}`,
						},
					},
				);

				if (!resultResponse.ok) {
					throw new Error(
						`Failed to get talk status: ${resultResponse.statusText}`,
					);
				}

				result = await resultResponse.json();
				console.log("Poll result:", result);

				if (result.status === "done") {
					setVideoUrl(result.result_url);
					setShowVideo(true);
					break;
				} else if (result.status === "failed") {
					throw new Error(
						`Video generation failed: ${result.error}`,
					);
				}

				// Wait for 2 seconds before polling again
				await new Promise((resolve) =>
					setTimeout(resolve, 2000),
				);
			}
		} catch (err: any) {
			console.error("Video generation error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};
	// Function to fetch data on button click
	const fetchText = async () => {
		if (!optimizationType) {
			setError("Optimization type is required");
			return;
		}

		try {
			setLoading(true); // Start loading
			setError(null); // Clear any previous errors
			const response = await fetch(
				`https://gmmfmpar9j.execute-api.ap-southeast-2.amazonaws.com/development/getPrescription?optimization_type=${optimizationType}`,
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const data = await response.json();
			console.log(data);

			const parts_text = Object.keys(data)
				.filter((key) => data[key]?.response) // Filter out keys without a valid response
				.map((key) => data[key].response) // Map to valid response strings
				.join("\n\n"); // Concatenate with double newlines for better readability

			// Concatenate valid responses while ignoring errors
			const parts = Object.keys(data)
				.filter((key) => data[key]?.response) // Filter out keys without a valid response
				.map((key, index) => (
					<div
						key={index}
						style={{ marginBottom: "1rem" }}
					>
						<strong>{`Part ${index + 1}:`}</strong>
						<p>{data[key].response}</p>
					</div>
				)); // Format responses as HTML

			setText(parts);
			await generateVideo(parts_text);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false); // End loading
		}
	};

	return (
		<div style={{ position: "relative" }}>
			{/* {loading && <p>Loading...</p>} */}

			<p>{text}</p>
			{!loading && !error && videoUrl && showVideo && (
				<video
					controls
					style={{
						position: "fixed",
						bottom: "10px",
						right: "10px",
						width: "300px",
						height: "auto",
						boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
						borderRadius: "8px",
					}}
				>
					<source
						src={videoUrl}
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			)}
			{!showVideo && (
				<button
					className={`py-3 px-4 rounded-md bg-black text-white font-bold transition-all duration-300  hover:bg-brand-orange hover:scale-105${
						optimizationType
							? ""
							: "cursor-not-allowed opacity-50"
					}`}
					onClick={() => fetchText()}
				>
					Present with AI
				</button>
			)}
			{loading && (
				<p className="mt-4 px-5 py-2 bg-blue-100 rounded-md w-fit flex flex-row gap-2 font-semibold">
					<Loader /> Loading...
				</p>
			)}
			{error && (
				<p className="mt-4 px-5 py-2 bg-red-300 rounded-md w-fit flex flex-row gap-2">
					<CircleX />
					<span className="font-semibold">Error:</span>{" "}
					{error}
				</p>
			)}
			{showVideo && (
				<button
					className={`py-3 px-4 rounded-md bg-red-500 text-white font-bold transition-all duration-300  hover:bg-red-900 hover:scale-105${
						optimizationType
							? ""
							: "cursor-not-allowed opacity-50"
					}`}
					onClick={() => setShowVideo(!showVideo)}
				>
					Hide Video
				</button>
			)}
		</div>
	);
}
