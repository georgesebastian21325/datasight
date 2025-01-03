"use client";

import { useGlobalState } from "../context/GlobalStateContext";
import EntityGraphsLoadingState from "../components/global/EntityGraphsLoadingState";
import React, { useState, useEffect } from "react";
import { ResourceGraphs } from "../components/global/ResourceGraphs";

import formatDataForService, {
	LineUsageCostChart,
	StackedBarChart,
} from "../components/global/ServiceGraphs";
import formatDataForProduct, {
	ProdStackedBarChart,
} from "../components/global/ProductGraphs";
import formatDataForOffering, {
	OffLineUsageCostChart,
	OffStackedBarChart,
} from "../components/global/OfferingGraphs";

// Base Metric Record Interface with more flexibility
interface MetricRecord {
	resource_id: string;
	metric_type?: string;
	week: string;
	weekly_revenue?: string;
	average_metric_value?: number;
	[key: string]: any; // Allow additional properties
}

interface ServiceMetricRecord extends MetricRecord {
	service_id: string;
	product_id?: string;
	offering_id?: string;
	resource_type: string;
	avg_usage: number; // Ensure type matches
	avg_cost: number;  // Ensure type matches
	date: string;
	year: string;      // Add the missing property
	month: string;     // Add the missing property
}


interface ProductMetricRecord extends MetricRecord {
	product_id: string;
	service_id: string;
	week: string;
	avg_usage: number; // Ensure type matches
	avg_cost: number;  // Ensure type matches
	date: string;
	month: string;
	year: string;
	weekly_revenue?: string; // Optional, if present
}

interface OfferingMetricRecord extends MetricRecord {
	offering_id: string;
	product_id: string;
	week: string;
	avg_usage: number; // Ensure type matches
	avg_cost: number;  // Ensure type matches
	date: string;
	weekly_revenue: string;
	service_id: string;      // Make it required
	resource_type: string;   // Make it required
	year: string;            // Add the missing property
	month: string;           // Add the missing property
}




export default function EntityGraphs() {
	const { selectedNodeId } = useGlobalState();
	const [isLoading, setIsLoading] =
		useState<boolean>(false);
	const [groupedData, setGroupedData] = useState<Record<
		string,
		any
	> | null>(null);
	const [activeTab, setActiveTab] = useState<string>("");

	const resourceEntityAPI =
		"https://8i6i5nm7ba.execute-api.ap-southeast-2.amazonaws.com/development/getEntityMetrics";

	const handleFetchData = async () => {
		try {
			setIsLoading(true);

			const response = await fetch(
				`${resourceEntityAPI}?entity_id=${selectedNodeId}`
			);

			setIsLoading(false);

			if (response.ok) {
				const result: MetricRecord[] = await response.json();

				// Map over the data to ensure correct types
				const formattedResult = result.map((record) => ({
					...record,
					avg_usage: parseFloat(record.avg_usage), // Ensure avg_usage is a number
					avg_cost: parseFloat(record.avg_cost),   // Optionally handle avg_cost similarly
				}));

				let grouped;
				if (selectedNodeId?.startsWith("SVC")) {
					grouped = formatDataForService(
						formattedResult as ServiceMetricRecord[]
					);
				} else if (selectedNodeId?.startsWith("P00")) {
					grouped = formatDataForProduct(
						formattedResult as ProductMetricRecord[]
					);
				} else if (selectedNodeId?.startsWith("OFF")) {
					grouped = formatDataForOffering(
						formattedResult as OfferingMetricRecord[]
					);
				} else {
					grouped = formattedResult.reduce(
						(
							acc: Record<string, MetricRecord[]>,
							record: MetricRecord
						) => {
							const metricType =
								record.metric_type || "default";
							if (!acc[metricType]) {
								acc[metricType] = [];
							}
							acc[metricType].push(record);
							return acc;
						},
						{}
					);
				}

				setGroupedData(grouped);
			} else {
				console.error("Error fetching data:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};


	useEffect(() => {
		if (selectedNodeId) {
			handleFetchData();
			setActiveTab("");
		}
	}, [selectedNodeId]);

	const renderChart = () => {
		if (
			!groupedData &&
			!selectedNodeId?.startsWith("SVC")
		) {
			return null;
		}

		// Service-specific charts
		if (groupedData && selectedNodeId?.startsWith("SVC")) {
			switch (activeTab) {
				case "lineUsageCost":
					return (
						<LineUsageCostChart
							data={groupedData.lineUsageCostData}
						/>
					);
				case "stackedUsage":
					return (
						<StackedBarChart
							data={groupedData.stackedUsageData}
							dataKey="usage"
							title="Stacked Usage for All Resources"
						/>
					);
				case "stackedCost":
					return (
						<StackedBarChart
							data={groupedData.stackedCostData}
							dataKey="cost"
							title="Stacked Cost for All Resources"
						/>
					);
				default:
					return null;
			}
		}

		// Product
		if (selectedNodeId?.startsWith("P00")) {
			switch (activeTab) {
				case "lineUsageCost":
					return (
						<LineUsageCostChart
							data={groupedData!.lineUsageCostData}
						/>
					);
				case "stackedUsage":
					return (
						<ProdStackedBarChart
							data={groupedData!.stackedUsageData}
							dataKey="usage"
							title="Stacked Usage for All Services"
						/>
					);
				case "stackedCost":
					return (
						<ProdStackedBarChart
							data={groupedData!.stackedCostData}
							dataKey="cost"
							title="Stacked Cost for All Services"
						/>
					);
				default:
					return null;
			}
		}

		// Offering
		if (selectedNodeId?.startsWith("OFF")) {
			switch (activeTab) {
				case "lineUsageCost":
					return (
						<OffLineUsageCostChart
							data={groupedData!.lineUsageCostData}
						/>
					);
				case "stackedUsage":
					return (
						<OffStackedBarChart
							data={groupedData!.stackedUsageData}
							dataKey="usage"
							title="Stacked Usage for All Products"
						/>
					);
				case "stackedCost":
					return (
						<OffStackedBarChart
							data={groupedData!.stackedCostData}
							dataKey="cost"
							title="Stacked Cost for All Products"
						/>
					);
				default:
					return null;
			}
		}

		return null;
	};

	// If no node is selected, return an empty container
	if (!selectedNodeId) {
		return (
			<div className="flex items-center justify-center h-[10%]"></div>
		);
	}

	return (
		<>
			{isLoading && <EntityGraphsLoadingState />}

			{/* Resource Graphs for non-Service/Product/Offering nodes */}
			{groupedData &&
				!isLoading &&
				!selectedNodeId?.startsWith("SVC") &&
				!selectedNodeId?.startsWith("P00") &&
				!selectedNodeId?.startsWith("OFF") && (
					<ResourceGraphs
						groupedData={groupedData}
						selectedNodeId={selectedNodeId ?? ""}
					/>
				)}

			{/* Service-specific graphs with tabs */}
			{groupedData &&
				!isLoading &&
				(selectedNodeId?.startsWith("SVC") ||
					selectedNodeId?.startsWith("P00") ||
					selectedNodeId?.startsWith("OFF")) && (
					<div className="flex flex-col justify-center text-center py-[2rem]">
						<h1 className="text-[1.5rem] font-bold">
							{selectedNodeId}
						</h1>
						<div className="tabs flex flex-row items-center justify-center gap-4 my-[1rem]">
							<button
								onClick={() =>
									setActiveTab("lineUsageCost")
								}
								className={`px-4 py-2 text-white rounded-md ${
									activeTab === "lineUsageCost"
										? "bg-brand-orange"
										: "bg-black"
								}`}
							>
								Line Usage & Cost
							</button>
							<button
								onClick={() => setActiveTab("stackedUsage")}
								className={`px-4 py-2 text-white rounded-md ${
									activeTab === "stackedUsage"
										? "bg-brand-orange"
										: "bg-black"
								}`}
							>
								Stacked Usage
							</button>
							<button
								onClick={() => setActiveTab("stackedCost")}
								className={`px-4 py-2 text-white rounded-md ${
									activeTab === "stackedCost"
										? "bg-brand-orange"
										: "bg-black"
								}`}
							>
								Stacked Cost
							</button>
						</div>
						<div className="chart-container">
							{renderChart()}
						</div>
					</div>
				)}
		</>
	);
}
