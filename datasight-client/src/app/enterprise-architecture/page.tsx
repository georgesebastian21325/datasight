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
import OptimizedOPSRMapping from "../data-mapping/OptimizedOPSRMapping";

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [optimizedLoading, setOptimizedLoading] =
		useState(false); // Separate state for optimized loading
	const [error, setError] = useState<string | null>(null);
	const [showMapping, setShowMapping] = useState(false);
	const { selectedNodeId, setSelectedNodeId } =
		useGlobalState();
	const [isOptimizedMapping, setIsOptimizedMapping] =
		useState(false);
	const [optimizationType, setOptimizationType] =
		useState("");

	const handleGenerateMapping = () => {
		setSelectedNodeId("");
		setError(null);
		setLoading(true);
		setShowMapping(true);
		setIsOptimizedMapping(false);
		setTimeout(() => {
			setLoading(false);
		}, 5000);
	};

	const handleGenerateOptimizedMapping = () => {
		setSelectedNodeId("");
		setError(null);
		setOptimizedLoading(true); // Set optimized loading state
		setShowMapping(true);
		setIsOptimizedMapping(true);
		setTimeout(() => {
			setOptimizedLoading(false); // Clear optimized loading state after 2 seconds
		}, 6000);
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
					{isOptimizedMapping
						? "Optimized Enterprise Architecture"
						: "Enterprise Architecture"}
				</h2>
				<p className="mb-3 text-gray-500">
					This is the current mapping of your enterprise
					architecture.
				</p>

				{/* Generate Mapping Buttons */}
				<div className="flex flex-col gap-2 mb-4 w-fit">
					<GenerateMappingBtn
						onGenerateMapping={handleGenerateMapping}
					/>
					<p className="mt-3 font-bold">
						Optimized Mapping
					</p>
					<p className=" text-gray-500">
						Select Optimization type for the mapping.
					</p>
					<div className="flex flex-row gap-2">
						<select
							id="fruit-select"
							value={optimizationType}
							onChange={(e) =>
								setOptimizationType(e.target.value)
							}
							className="block w-fit px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="default">
								Choose an option
							</option>
							<option value="capacity">Capacity</option>
							<option value="finance">Finance</option>
							<option value="risk">Risk</option>
							<option value="obsolescence">
								Obsolescence
							</option>
						</select>
						<GenerateOptimizedMappingBtn
							onGenerateOptimizedMapping={
								handleGenerateOptimizedMapping
							}
						/>
					</div>
				</div>

				{/* Always show the dashed container */}
				<div className="flex items-center justify-center w-full h-[calc(100%-80px)] border-2 border-dashed border-gray-300 rounded-lg">
					{!isOptimizedMapping && (
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
					)}
					{isOptimizedMapping && (
						<div className="w-full min-w-[1200px]">
							{/* Conditionally render the mapping data or the loading state */}
							{loading ? (
								<DataMappingLoadingState />
							) : optimizedLoading ? (
								<OptimizedDataMappingLoadingState />
							) : showMapping ? (
								<OptimizedOPSRMapping
									optimizationType={optimizationType}
								/>
							) : (
								<p className="text-center text-gray-500">
									Click &quot;Generate Mapping&quot; to view
									the architecture mapping
								</p>
							)}
						</div>
					)}
				</div>
				<EntityGraphs />
			</div>
		</div>
	);
}
