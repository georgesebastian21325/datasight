"use client";

import { useState } from "react";
import OPSRMapping from "../data-mapping/OPSRMapping";
import GenerateMappingBtn from "../components/button/GenerateMappingBtn";
import DataMappingLoadingState from "../components/global/DataMappingLoadingState";
import OptimizedDataMappingLoadingState from "../components/global/OptimizedDataMappingLoadingState";
import { useGlobalState } from "../context/GlobalStateContext";
import EntityGraphs from "../entity-graphs/entity-graphs";
import NavigationBar from "../components/global/NavigationBar";
import GenerateOptimizedFinanceMappingBtn from "../components/button/GenerateOptimizedFinanceMappingBtn";
import GenerateOptimizedRiskMappingBtn from "../components/button/GenerateOptimizedRiskMappingBtn";
import OptimizedOPSRFinanceMapping from "../data-mapping/OptimizedOPSRFinanceMapping";
import OptimizedOPSRRiskMapping from "../data-mapping/OptimizedOPSRRiskMapping"; // Import the Risk Mapping component
import AIPresenter from "../components/global/AIPresenter";
import { MappingViewPopUp } from "../components/popup";

import RiskOptimizationTable from "@/vcomponents/RiskOptimizationTable";
import ProfitabilityOptimizationTable from "@/vcomponents/ProfitabilityOptimizationTable";

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [optimizedLoading, setOptimizedLoading] =
		useState(false); // Separate state for optimized loading
	const [showMapping, setShowMapping] = useState(false);
	const { selectedNodeId, setSelectedNodeId } =
		useGlobalState();
	const [isOptimizedMapping, setIsOptimizedMapping] =
		useState(false);
	const [optimizationType, setOptimizationType] =
		useState("");
	const [message, setMessage] = useState(
		"Current Mapping In View",
	);
	const [bgColor, setBgColor] = useState("bg-blue-200"); // Default bg color

	const [showMessage, setShowMessage] = useState(false); // Control message visibility

	const handleGenerateMapping = () => {
		setSelectedNodeId("");
		setLoading(true);
		setShowMapping(true);
		setIsOptimizedMapping(false);
		setOptimizationType(""); // Reset optimization type
		setMessage("Current Mapping In View"); // Set message for Generate Mapping
		setBgColor("bg-blue-200"); // Set background color for current mapping
		setShowMessage(false); // Hide message initially
		setTimeout(() => {
			setLoading(false); // Set loading to false after 5 seconds
			setShowMessage(true); // Show message after loading completes
		}, 5000);
	};

	const handleGenerateOptimizedRiskMapping = () => {
		setSelectedNodeId("");
		setOptimizedLoading(true); // Set optimized loading state
		setShowMapping(true);
		setIsOptimizedMapping(true);
		setOptimizationType("risk"); // Set optimization type to 'risk'
		setMessage("Optimized-Risk Mapping In View"); // Set message for Optimized Mapping
		setBgColor("bg-orange-200"); // Set background color for optimized mapping
		setShowMessage(false); // Hide message initially
		setTimeout(() => {
			setOptimizedLoading(false); // Clear optimized loading state after 6 seconds
			setShowMessage(true); // Show message after optimized loading completes
		}, 6000);
	};

	const handleGenerateOptimizedFinanceMapping = () => {
		setSelectedNodeId("");
		setOptimizedLoading(true); // Set optimized loading state
		setShowMapping(true);
		setIsOptimizedMapping(true);
		setOptimizationType("finance"); // Set optimization type to 'finance'
		setMessage("Optimized-Finance Mapping In View"); // Set message for Optimized Mapping
		setBgColor("bg-green-200"); // Set background color for optimized mapping
		setShowMessage(false); // Hide message initially
		setTimeout(() => {
			setOptimizedLoading(false); // Clear optimized loading state after 6 seconds
			setShowMessage(true); // Show message after optimized loading completes
		}, 6000);
	};

	return (
		<div className="flex flex-col h-screen ">
			<NavigationBar />
			{/* Right side - Enterprise Mapping */}
			<div className="mx-auto p-4 h-screen w-[90%]">
				<h2 className="text-center bg-black text-3xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820] ">
					{isOptimizedMapping
						? `${optimizationType.toUpperCase()} OPTIMIZED ENTERPRISE ARCHITECTURE`
						: "ENTERPRISE ARCHITECTURE"}
				</h2>

				{/* Generate Mapping Buttons */}
				<div className="flex flex-row gap-4 mb-4 w-full justify-between">
					<div>
						<GenerateMappingBtn
							onGenerateMapping={handleGenerateMapping}
						/>
					</div>
					<div className="flex flex-row gap-4">
						<GenerateOptimizedFinanceMappingBtn
							onGenerateOptimizedFinanceMapping={
								handleGenerateOptimizedFinanceMapping
							}
						/>
						<GenerateOptimizedRiskMappingBtn
							onGenerateOptimizedRiskMapping={
								handleGenerateOptimizedRiskMapping
							}
						/>
					</div>
					{/* Move AIPresenter to the right side */}
					<div className="ml-auto">
						<AIPresenter
							optimizationType={optimizationType}
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
								optimizationType === "risk" ? (
									<OptimizedOPSRRiskMapping />
								) : optimizationType === "finance" ? (
									<OptimizedOPSRFinanceMapping />
								) : (
									<p className="text-center text-gray-500">
										No optimization type selected.
									</p>
								)
							) : (
								<p className="text-center text-gray-500">
									Click &quot;Generate Mapping&quot; to view
									the architecture mapping
								</p>
							)}
						</div>
					)}
				</div>
				{(loading || optimizedLoading || showMessage) && (
					<MappingViewPopUp
						message={message}
						bgColor={bgColor}
						loading={loading || optimizedLoading}
					/>
				)}
				{optimizationType === "" && <EntityGraphs />}

				{optimizationType === "risk" && (
					<RiskOptimizationTable />
				)}

				{optimizationType === "finance" && (
					<ProfitabilityOptimizationTable />
				)}
			</div>
		</div>
	);
}
