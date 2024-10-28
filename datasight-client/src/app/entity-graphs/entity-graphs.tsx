"use client";

import { useGlobalState } from "../context/GlobalStateContext";
import EntityGraphsLoadingState from "../components/global/EntityGraphsLoadingState";
import React, { useState, useEffect } from "react";
import { ResourceGraphs } from "../components/global/ResourceGraphs";
import formatDataForServiceGraphs, {
	DualAxisLineChart,
	ResourceTypeCostBarChart,
	UsageVsCostScatterPlot,
	WeeklyCostChart,
	WeeklyUsageChart,
} from "../components/global/ServiceGraphs";

interface MetricRecord {
	resource_id: string;
	metric_type: string;
	week: string;
	average_metric_value: number;
}

interface GroupedData {
	[metric_type: string]: MetricRecord[];
}

interface ServiceMetricRecord extends MetricRecord {
	service_id: string;
	resource_type: string;
	avg_usage: string;
	avg_cost: string;
	date: string;
}

export default function EntityGraphs() {
	const { selectedNodeId } = useGlobalState();
	const [isLoading, setIsLoading] =
		useState<Boolean>(false);
	const [groupedData, setGroupedData] = useState<Record<
		string,
		any
	> | null>(null);
	const [activeTab, setActiveTab] =
		useState<string>("weeklyUsage");
	const resourceEntityAPI =
		"https://8i6i5nm7ba.execute-api.ap-southeast-2.amazonaws.com/development/getEntityMetrics";

	const handleFetchData = async () => {
		try {
			setIsLoading(true);

			const response = await fetch(
				`${resourceEntityAPI}?entity_id=${selectedNodeId}`,
			);

			setIsLoading(false);

			if (response.ok) {
				const result: MetricRecord[] =
					await response.json();
				let grouped;
				if (selectedNodeId?.startsWith("SVC")) {
					grouped = formatDataForServiceGraphs(
						result as ServiceMetricRecord[],
					);
				} else {
					grouped = result.reduce(
						(acc: GroupedData, record: MetricRecord) => {
							const { metric_type } = record;
							if (!acc[metric_type]) {
								acc[metric_type] = [];
							}
							acc[metric_type].push(record);
							return acc;
						},
						{},
					);
				}

				setGroupedData(grouped);
				console.log(grouped);
			} else {
				console.error(
					"Error fetching data:",
					response.statusText,
				);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		if (selectedNodeId) {
			handleFetchData();
		}
	}, [selectedNodeId]);

	const renderChart = () => {
		if (!groupedData && !selectedNodeId?.startsWith("SVC"))
			return null;

		switch (activeTab) {
			case "weeklyUsage":
				return (
					<WeeklyUsageChart
						data={groupedData!.weeklyUsage}
					/>
				);
			case "weeklyCost":
				return (
					<WeeklyCostChart data={groupedData!.weeklyCost} />
				);
			case "resourceTypeCost":
				return (
					<ResourceTypeCostBarChart
						data={groupedData!.resourceTypeCost}
					/>
				);
			case "dualAxis":
				return (
					<DualAxisLineChart
						data={groupedData!.dualAxisData}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<>
			{isLoading && <EntityGraphsLoadingState />}
			{/* {groupedData && !isLoading && (
				<ResourceGraphs
					groupedData={groupedData}
					selectedNodeId={selectedNodeId ?? ""}
				/>
			)} */}
			{groupedData && !isLoading && (
				<div className="flex flex-col justify-center text-center py-[2rem]">
					<h1 className="text-[1.5rem] font-bold">
						{selectedNodeId}
					</h1>
					<div className="tabs flex flex-row items-center justify-center gap-4 my-[1rem]">
						<button
							onClick={() => setActiveTab("weeklyUsage")}
							className={`px-4 py-2 text-white rounded-md ${
								activeTab == "weeklyUsage"
									? "bg-brand-orange"
									: "bg-black"
							}`}
						>
							Weekly Usage
						</button>
						<button
							onClick={() => setActiveTab("weeklyCost")}
							className={`px-4 py-2 text-white rounded-md ${
								activeTab == "weeklyCost"
									? "bg-brand-orange"
									: "bg-black"
							}`}
						>
							Weekly Cost
						</button>
						<button
							onClick={() =>
								setActiveTab("resourceTypeCost")
							}
							className={`px-4 py-2 text-white rounded-md ${
								activeTab == "resourceTypeCost"
									? "bg-brand-orange"
									: "bg-black"
							}`}
						>
							Resource Type Cost
						</button>
						<button
							onClick={() => setActiveTab("dualAxis")}
							className={`px-4 py-2 text-white rounded-md ${
								activeTab == "dualAxis"
									? "bg-brand-orange"
									: "bg-black"
							}`}
						>
							Dual Axis
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
