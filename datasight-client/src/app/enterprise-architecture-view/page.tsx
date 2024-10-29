"use client";

import { useState } from "react";
import Header from "../components/global/header";
import OPSRMapping from "../data-mapping/OPSRMapping";

import GenerateMappingBtn from "../components/button/GenerateMappingBtn"; // Import the new button component
import DataMappingLoadingState from "../components/global/DataMappingLoadingState";
import FileUploadModal from "../components/modal/FileUploadModal";
import OpenFileUploadModalBtn from "../components/button/OpenFileUploadModalBtn";
import { useGlobalState } from "../context/GlobalStateContext"; // Import the global state

import Link from "next/link";
import EntityGraphs from "../entity-graphs/entity-graphs";

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showMapping, setShowMapping] = useState(false);
	const { selectedNodeId, setSelectedNodeId } =
		useGlobalState();

	const handleGenerateMapping = () => {
		setError(null);
		setLoading(true);
		setShowMapping(true);

		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	const [isFileUploadModalOpen, setIsFileUploadModalOpen] =
		useState(false);

	const openModal = () => setIsFileUploadModalOpen(true);
	const closeModal = () => setIsFileUploadModalOpen(false);

	return (
		<div className="flex flex-col lg:flex-row h-screen relative">
			{/* Back Button */}
			<Link href="/home-page">
				<button className="absolute rounded-md top-4 right-4 px-4 py-2 text-white bg-black hover:bg-gray-500 transition-transform transform hover:scale-105 font-medium shadow-sm">
					Back
				</button>
			</Link>

			{/* Left sidebar - Console */}
			<div className="w-full lg:w-1/5 h-full overflow-auto border-r border-gray-200 p-4 flex flex-col">
				{/* Logo */}
				<div className="mb-8">
					<Header />
				</div>

				<h2 className="text-xl font-bold mb-4">
					Optimization Options
				</h2>
				<div className="space-y-2 flex-grow">
					<button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">
						Obsolescences
					</button>
					<button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">
						Capacity
					</button>
					<button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">
						Finance
					</button>
					<button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">
						Risk
					</button>
				</div>

				<button className="mt-12 py-2 mb-12 lg:mt-auto lg:mb-4 lg:px-6 lg:py-2 bg-yellow-500 hover:bg-gray-900 text-white rounded">
					Present With AI
				</button>
			</div>

			{/* Right side - Enterprise Mapping */}
			<div className="w-full lg:w-4/5 h-full overflow-auto p-4 pt-16">
				<h2 className="text-2xl font-bold mb-1 gradient-text">
					Enterprise Architecture
				</h2>
				<p className="mb-3 text-gray-500">
					{" "}
					This is the current mapping of your enterprise
					architecture.{" "}
				</p>

				{/* Generate Mapping Button in separate component */}
				<div className="flex space-x-4 mb-4">
					<GenerateMappingBtn
						onGenerateMapping={handleGenerateMapping}
					/>
					<OpenFileUploadModalBtn openModal={openModal} />
					<button
						onClick={() => {
							setSelectedNodeId("P0001");
						}}
					>
						Product 1
					</button>
					<div>
						<FileUploadModal
							isModalOpen={isFileUploadModalOpen}
							closeModal={closeModal}
						/>
					</div>
				</div>

				{/* Always show the dashed container */}
				<div className="flex items-center justify-center w-full h-[calc(100%-80px)] border-2 border-dashed border-gray-300 rounded-lg ">
					<div className="w-full h-50 min-w-[1200px]">
						{" "}
						{/* Ensure full width */}
						{/* Conditionally render the mapping data or the loading state */}
						{loading ? (
							<DataMappingLoadingState /> // Show loading spinner
						) : showMapping ? (
							<OPSRMapping />
						) : (
							<p className="text-center text-gray-500">
								Click &quot;Generate Mapping&quot; to view
								the architecture mapping
							</p>
						)}
					</div>
				</div>
				<EntityGraphs />
			</div>
		</div>
	);
}
