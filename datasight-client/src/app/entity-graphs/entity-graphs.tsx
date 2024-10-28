"use client";

import { useGlobalState } from "../context/GlobalStateContext";
import EntityGraphsLoadingState from "../components/global/EntityGraphsLoadingState";
import React, { useState, useEffect } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface MetricRecord {
	resource_id: string;
	metric_type: string;
	week: string;
	average_metric_value: number;
}

interface GroupedData {
	[metric_type: string]: MetricRecord[];
}

export default function EntityGraphs() {
	const { selectedNodeId } = useGlobalState();
	const [isLoading, setIsLoading] =
		useState<Boolean>(false);
	const [groupedData, setGroupedData] = useState<Record<
		string,
		any
	> | null>(null);
	const resourceEntityAPI =
		"https://8i6i5nm7ba.execute-api.ap-southeast-2.amazonaws.com/development/getEntityMetrics";

	const handleFetchData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`${resourceEntityAPI}?resource_id=${selectedNodeId}`,
			);
			setIsLoading(false);

			if (response.ok) {
				const result: MetricRecord[] =
					await response.json();

				const grouped = result.reduce(
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

	return (
		<>
			{isLoading && <EntityGraphsLoadingState />}
			{groupedData && !isLoading && (
				<div>
					<h1>Entity Graphs for Node: {selectedNodeId}</h1>
					<div className="grid grid-cols-2 gap-2">
						{groupedData ? (
							Object.entries(groupedData).map(
								([metricType, records]) => (
									<div
										key={metricType}
										style={{ marginBottom: "2rem" }}
									>
										<h2>{metricType}</h2>
										<ResponsiveContainer
											width="100%"
											height={400}
										>
											<LineChart data={records}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="week" />
												<YAxis />
												<Tooltip />
												<Legend />
												<Line
													type="natural"
													dataKey="average_metric_value"
													stroke="#8884d8"
													strokeWidth={1}
													activeDot={{ r: 8 }}
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
								),
							)
						) : (
							<p>Loading data...</p>
						)}
					</div>
				</div>
			)}
		</>
	);
}
