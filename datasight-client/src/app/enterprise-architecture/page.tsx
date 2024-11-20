"use client";

import { useState } from "react";
import Header from "../components/global/header";
import OPSRMapping from "../data-mapping/OPSRMapping";

import GenerateMappingBtn from "../components/button/GenerateMappingBtn";
import DataMappingLoadingState from "../components/global/DataMappingLoadingState";
import OptimizedDataMappingLoadingState from "../components/global/OptimizedDataMappingLoadingState";
import { useGlobalState } from "../context/GlobalStateContext";

import EntityGraphs from "../entity-graphs/entity-graphs";
import NavigationBar from "../components/global/NavigationBar";
import GenerateOptimizedMappingBtn from "../components/button/GenerateOptimizedMappingBtn";

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [optimizedLoading, setOptimizedLoading] = useState(false); // Separate state for optimized loading
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

	const handleGenerateOptimizedMapping = () => {
		setError(null);
		setOptimizedLoading(true); // Set optimized loading state
		setShowMapping(true);

		setTimeout(() => {
			setOptimizedLoading(false); // Clear optimized loading state after 2 seconds
		}, 2000);
	};

	const [isFileUploadModalOpen, setIsFileUploadModalOpen] =
		useState(false);

	const openModal = () => setIsFileUploadModalOpen(true);
	const closeModal = () => setIsFileUploadModalOpen(false);

	return (
		<div className="flex flex-col h-screen ">
			<NavigationBar />
			{/* Right side - Enterprise Mapping */}
			<div className="mx-auto p-4 pt-16 h-screen w-[90%]">
				<h2 className="text-2xl font-bold mb-1 gradient-text">
					Enterprise Architecture
				</h2>
				<p className="mb-3 text-gray-500">
					This is the current mapping of your enterprise
					architecture.
				</p>

				{/* Generate Mapping Buttons */}
				<div className="flex space-x-4 mb-4">
					<GenerateMappingBtn
						onGenerateMapping={handleGenerateMapping}
					/>
					<GenerateOptimizedMappingBtn
						onGenerateOptimizedMapping={
							handleGenerateOptimizedMapping
						}
					/>
				</div>

				{/* Always show the dashed container */}
				<div className="flex items-center justify-center w-full h-[calc(100%-80px)] border-2 border-dashed border-gray-300 rounded-lg">
					<div className="w-full min-w-[1200px]">
						{/* Conditionally render the mapping data or the loading state */}
						{loading ? (
							<DataMappingLoadingState />
						) : optimizedLoading ? (
							<OptimizedDataMappingLoadingState />
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
