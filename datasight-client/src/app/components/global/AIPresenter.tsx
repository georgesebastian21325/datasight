import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import ActionButtons from "../button/AIPresenterBtn"; // Assuming your ActionButtons component is in this directory

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
	const [showResultsButton, setShowResultsButton] = useState(false); // State to control "View Results" button visibility

	const API_KEY = "anVkZ2UubW9uZ2NhbC5jaWNzQHVzdC5lZHUucGg:o7TU4ENjRnOh689pHzlx2"; // Your API key (ensure to keep it safe)

	// Set up scroll listener for handling scroll events
	useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY); // Update scroll position on scroll
		};

		window.addEventListener("scroll", handleScroll); // Adding event listener

		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Auto-clear error after 2 seconds
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	// Function to generate a video using the D-ID API
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
						"https://img.freepik.com/premium-photo/free-photo-business-finance-employment-female_837074-7695.jpg", // Example image URL
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
					setVideoUrl(result.result_url); // Video URL after successful creation
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
			setError(err.message); // Error handling
		} finally {
			setLoading(false);
		}
	};

	// Function to fetch data from API on button click
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

			// Parse the response and clean up the text for presentation
			const part1Response = data.first_response?.part1?.response || "No valid response received.";

			// Clean up the text for HTML formatting
			const formattedText = part1Response
				.replace(/^([^\d]+):/gm, "$1:")
				.replace(/\n/g, "<br />")
				.replace(/###/g, "")
				.replace(/#/g, "")
				.replace(/\*/g, "")
				.replace(/\*\*/g, "")
				.replace(/#/g, "");
			setText(formattedText); // Set formatted text
		} catch (error) {
			setError(error.message); // Error handling
		} finally {
			setLoading(false);
		}
	};

	// Toggle the modal visibility
	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	// Toggle the minimized state for the modal
	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
	};

	// Handle the "Present with AI" button click
	const handlePresentWithAI = () => {
		setShowResultsButton(true); // Show the "View Results" button after fetching text
		fetchText();
	};

	return (
		<div style={{ position: "relative" }} className="flex flex-row gap-x-4">
			<ActionButtons
				loading={loading}
				error={error}
				optimizationType={optimizationType}
				fetchText={handlePresentWithAI} // Pass the new handler to fetch text
				toggleModal={toggleModal}
				showVideo={showVideo}
				setShowVideo={setShowVideo}
				showResultsButton={showResultsButton} // Pass the state to control button visibility
			/>

			{/* Additional modal or content rendering */}
			{modalOpen && (
				<div className="modal">
					<button onClick={toggleModal}>
						<CircleX size={24} />
					</button>
					<div>{text && <div dangerouslySetInnerHTML={{ __html: text }} />}</div>
				</div>
			)}

			{/* Conditionally render the video if available */}
			{showVideo && videoUrl && (
				<div>
					<video controls src={videoUrl}></video>
				</div>
			)}
		</div>
	);
}
