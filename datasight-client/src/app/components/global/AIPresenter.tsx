import React, { useState, useEffect } from "react";
import { CircleX, Loader, Minimize2 } from "lucide-react";

interface OptimizedOPSRMappingProps {
	optimizationType: string;
}

export default function AIPresenter({
	optimizationType,
}: OptimizedOPSRMappingProps) {
	const [text, setText] = useState<string>(""); // State to store the fetched text
	const [loading, setLoading] = useState<boolean>(false); // State to handle loading status
	const [error, setError] = useState<string | null>(null); // State to handle errors
	const [videoUrl, setVideoUrl] = useState<string | null>(null); // State to store the generated video URL
	const [showVideo, setShowVideo] = useState(false);
	const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
	const [isMinimized, setIsMinimized] = useState(false); // State for minimizing the modal
	const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position

	const API_KEY =
		"anVkZ2UubW9uZ2NhbC5jaWNzQHVzdC5lZHUucGg:o7TU4ENjRnOh689pHzlx2";

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
			setError("No text available for generating the video.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// Step 1: Create the talk
			const createResponse = await fetch("https://api.d-id.com/talks", {
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
			});

			if (!createResponse.ok) {
				const errorData = await createResponse.json();
				throw new Error(
					`Failed to create talk: ${errorData.message || createResponse.statusText}`
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
					}
				);

				if (!resultResponse.ok) {
					throw new Error(`Failed to get talk status: ${resultResponse.statusText}`);
				}

				result = await resultResponse.json();
				console.log("Poll result:", result);

				if (result.status === "done") {
					setVideoUrl(result.result_url);
					setShowVideo(true);
					break;
				} else if (result.status === "failed") {
					throw new Error(`Video generation failed: ${result.error}`);
				}

				// Wait for 2 seconds before polling again
				await new Promise((resolve) => setTimeout(resolve, 2000));
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
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`https://gmmfmpar9j.execute-api.ap-southeast-2.amazonaws.com/development/getPrescription?optimization_type=risk`
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const data = await response.json();

			// Fetch the response and parse markdown to HTML
			const part1Response = data.first_response?.part1?.response || "No valid response received.";

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
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	// Toggle the modal visibility
	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	// Toggle the minimize state
	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
	};

	return (
		<div style={{ position: "relative" }} className="flex flex-row gap-x-4">
			{/* Button to trigger modal */}

			{(loading &&
				<p className="text-center items-center px-5 bg-blue-100 rounded-md flex flex-row gap-2 font-semibold ">
					<span className="loading"></span>Loading AI Presenter
				</p>
			)}




			<button
				onClick={toggleModal}
				className="py-3 px-4 rounded-md bg-black text-white font-medium transition-all duration-300 hover:bg-brand-orange hover:scale-105"
			>
				View Results
			</button>

			{modalOpen && (
				<div
					style={{
						position: "absolute",
						left: "-1250px",
						top: 150 + scrollPosition + "px",
						width: isMinimized ? "250px" : "450px",
						maxHeight: "300px",
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
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<h3 className="font-bold" style={{ margin: 0 }}>
							Optimization Results
						</h3>
						<div className='mt-[-0.75rem]'>
							<button
								onClick={toggleMinimize}
								style={{
									backgroundColor: "yellow",
									borderRadius: "60%",
									padding: "5px",
									border: "none",
									cursor: "pointer"
								}}
							>
							</button>
							<button
								onClick={toggleModal} // This will close the modal
								style={{
									backgroundColor: "red",
									borderRadius: "60%",
									padding: "5px",
									border: "none",
									cursor: "pointer",
									marginLeft: "10px",
								}}
							>

							</button>
						</div>
					</div>

					{/* Modal Body */}
					{!isMinimized && (
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
					className={`py-3 px-4 rounded-md bg-black text-white font-medium transition-all duration-300 hover:bg-brand-orange hover:scale-105${optimizationType ? "" : "cursor-not-allowed opacity-50"
						}`}
					onClick={() => fetchText()}
				>
					Present with AI
				</button>
			)}


			{error && (
				<p className="mt-4 px-5 py-2 bg-red-300 rounded-md w-fit flex flex-row gap-2">
					<CircleX />
					<span className="font-semibold">Error:</span> {error}
				</p>
			)}

			{showVideo && (
				<button
					className={`py-3 px-4 rounded-md bg-red-500 text-white font-bold transition-all duration-300 hover:bg-red-900 hover:scale-105${optimizationType ? "" : "cursor-not-allowed opacity-50"
						}`}
					onClick={() => setShowVideo(!showVideo)}
				>
					Hide Video
				</button>
			)}
		</div>
	);
}
