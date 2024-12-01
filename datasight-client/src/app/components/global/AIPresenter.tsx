import React, { useState, useEffect } from "react";

interface OptimizedOPSRMappingProps {
	optimizationType: string;
}

export default function AIPresenter({
	optimizationType,
}: OptimizedOPSRMappingProps) {
	const [text, setText] = useState<string>(""); // State to store the fetched text
	const [loading, setLoading] = useState<boolean>(false); // State to handle loading status
	const [error, setError] = useState<string | null>(null); // State to handle errors
	const [videoUrl, setVideoUrl] = useState<string | null>(
		null,
	); // State to store the generated video URL
	const [showVideo, setShowVideo] = useState(false);
	const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
	const [optimizationMinimized, setOptimizationMinimized] =
		useState(false); // Separate state for optimization results minimize
	const [videoMinimized, setVideoMinimized] =
		useState(false); // Separate state for AI presenter video minimize
	const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position

	const API_KEY =
		"ZGVuaWNlbWFyaWUuZGFkdWxsYS5jaWNzQHVzdC5lZHUucGg:-vvKwRgDKdXBGLqaUqk9v"; // Replace with your actual API key

	useEffect(() => {
		// Set up a scroll event listener
		const handleScroll = () => {
			setScrollPosition(window.scrollY); // Update scroll position on scroll
		};

		// Add event listener when the component mounts
		window.addEventListener("scroll", handleScroll);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

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
						"Content-Type": "application/json",
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
					console.log("Video URL:", result.result_url);
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
			setError(
				err.message || "An unexpected error occurred.",
			);
		} finally {
			setLoading(false);
		}
	};

	// Function to fetch data on button click
	const fetchText = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`https://gmmfmpar9j.execute-api.ap-southeast-2.amazonaws.com/development/getPrescription?optimization_type=${optimizationType}`,
			);

			console.log(response.statusText);
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const data = await response.json();

			// Fetch the response and parse markdown to HTML
			const part1Response =
				data.first_response?.part1?.response ||
				"No valid response received.";

			// Format the text into a cleaner structure with **bold headers**
			const formattedText = part1Response
				.replace(/^([^\d]+):/gm, "$1:")
				.replace(/\n/g, "<br />")
				.replace(/###/g, "")
				.replace(/#/g, "")
				.replace(/\*/g, "")
				.replace(/\*\*/g, "")
				.replace(/#/g, "");
			setText(formattedText);

			// Call the generateVideo function and pass the formatted text
			await generateVideo(formattedText);
		} catch (err: any) {
			setError(
				err.message || "An unexpected error occurred.",
			);
		} finally {
			setLoading(false);
		}
	};

	// Toggle the modal visibility
	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	// Toggle the minimize state for the optimization results modal
	const toggleOptimizationMinimize = () => {
		setOptimizationMinimized(!optimizationMinimized);
	};

	// Toggle the minimize state for the video container
	const toggleVideoMinimize = () => {
		setVideoMinimized(!videoMinimized);
	};

	// Close the modal for optimization results
	const closeOptimizationModal = () => {
		setModalOpen(false);
	};

	// Close the AI Presenter video
	const closeVideoModal = () => {
		setShowVideo(false); // Close the video modal
	};

	return (
		<div
			style={{ position: "relative" }}
			className="flex flex-row gap-x-4"
		>
			{/* Button to trigger modal */}
			{loading && (
				<p className="text-center items-center px-5 bg-green-300 rounded-md flex flex-row gap-2 font-semibold ">
					<span className="loading"></span>Loading AI
					Presenter
				</p>
			)}

			<button
				onClick={toggleModal}
				className={`py-3 px-4 rounded-md bg-black text-white font-medium transition-all duration-300 hover:bg-brand-orange hover:scale-105 ${
					text ? "" : "cursor-not-allowed opacity-50"
				}`}
			>
				View Results
			</button>

			{modalOpen && (
				<div
					style={{
						position: "absolute",
						left: "-1250px",
						top: 60 + scrollPosition + "px",
						width: optimizationMinimized
							? "250px"
							: "450px",
						maxHeight: "500px",
						padding: "10px",
						backgroundColor: "white",
						borderRadius: "8px",
						zIndex: 9999,
						overflowY: "auto",
						transition: "width 0.3s, height 0.3s",
					}}
					className="shadow-2xl border-2"
				>
					{/* Modal Header */}
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<h3
							className="font-bold"
							style={{ margin: 0 }}
						>
							Optimization Results
						</h3>
						<div className="flex gap-x-2">
							<button
								onClick={toggleOptimizationMinimize}
								style={{
									backgroundColor: "yellow",
									borderRadius: "60%",
									padding: "5px",
									border: "none",
									cursor: "pointer",
								}}
							></button>
							<button
								onClick={closeOptimizationModal} // This will close the modal
								style={{
									backgroundColor: "red",
									borderRadius: "60%",
									padding: "5px",
									border: "none",
									cursor: "pointer",
									marginLeft: "10px",
								}}
							></button>
						</div>
					</div>

					{/* Modal Body */}
					{!optimizationMinimized && (
						<div
							style={{
								whiteSpace: "normal",
								fontSize: "14px",
								lineHeight: "1.6",
								color: "#333",
							}}
							dangerouslySetInnerHTML={{ __html: text }}
						/>
					)}
				</div>
			)}

			{!showVideo && (
				<button
					className={`py-3 px-4 rounded-md bg-black text-white font-medium transition-all duration-300 hover:bg-green-800 hover:scale-105 ${
						optimizationType === "risk" ||
						optimizationType === "finance"
							? ""
							: "cursor-not-allowed opacity-50"
					}`}
					onClick={() => fetchText()}
					disabled={
						!(
							optimizationType === "risk" ||
							optimizationType === "finance"
						)
					} // Disable when optimizationType is invalid
				>
					Present with AI
				</button>
			)}

			{error && (
				<p className="mt-4 px-5 py-2 bg-red-300 rounded-md w-fit flex flex-row gap-2">
					<span className="font-semibold">Error:</span>{" "}
					{error}
				</p>
			)}

			{/* Conditionally render the video container */}
			{showVideo && videoUrl && (
				<div
					style={{
						position: "absolute",
						right: "-30px",
						top: 150 + scrollPosition + "px",
						width: videoMinimized ? "250px" : "450px",
						maxHeight: "500px",
						padding: "10px",
						backgroundColor: "white",
						borderRadius: "8px",
						zIndex: 9999,
						overflowY: "auto",
						transition: "width 0.3s, height 0.3s",
					}}
					className="border border-1"
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<p
							className="font-bold"
							style={{ margin: 0 }}
						>
							AI Presenter
						</p>
						<div className="flex gap-x-2">
							{/* Minimize Button */}
							<button
								onClick={toggleVideoMinimize}
								style={{
									backgroundColor: "yellow",
									borderRadius: "60%",
									padding: "5px",
									border: "none",
									cursor: "pointer",
								}}
							></button>
							<button
								onClick={closeVideoModal}
								style={{
									backgroundColor: "red",
									borderRadius: "60%",
									padding: "5px",
									border: "none",
									cursor: "pointer",
									marginLeft: "10px",
								}}
							></button>
						</div>
					</div>

					{/* Video */}
					{!loading && !error && videoUrl && (
						<video
							controls
							style={{
								width: "100%", // Ensure video width is responsive to the container width
								height: "100%",
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
				</div>
			)}

			{showVideo && (
				<button
					className={`py-3 px-4 rounded-md bg-red-500 text-white font-bold transition-all duration-300 hover:bg-red-900 hover:scale-105${
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
