import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
} from "recharts";

// Props Interfaces
interface ParsedMetricRecord {
	week: string;
	avg_usage: number;
	month: string;
	avg_cost: number;
	resource_id: string;
	usage_percentage?: number;
	resource_cost?: number;
}

interface WeeklyUsageChartProps {
	data: Record<string, ParsedMetricRecord[]>;
}

interface StackedBarChartProps {
	data: {
		resource_id: string;
		usage: number;
		cost: number;
	}[];
	dataKey: "usage" | "cost";
	title: string;
}

interface MetricRecord {
	service_id?: string;
	resource_id?: string;
	product_id?: string;
	offering_id?: string;
	resource_type?: string;
	week?: string;
	avg_usage: number; // Original data as string
	avg_cost: number; // Original data as string
	date?: string;
	usage_percentage?: number;
	resource_cost?: number;
	service_cost?: number;
	year: string;
	month: string;
}

interface ParsedMetricRecord {
	service_id: string;
	resource_id: string;
	resource_type: string;
	week: string;
	avg_usage: number;
	avg_cost: number;
	date: string;
	month: string;
}

interface FormattedData {
	weeklyUsage: Record<string, ParsedMetricRecord[]>; // For Weekly Average Usage Line Chart
	weeklyCost: Record<string, ParsedMetricRecord[]>; // For Weekly Average Cost Line Chart
	lineUsageCostData: Record<string, ParsedMetricRecord[]>; // For Line Chart (Usage & Cost)
	stackedUsageData: {
		resource_id?: string;
		usage: number;
		cost: number;
	}[]; // For Stacked Usage Chart
	stackedCostData: {
		resource_id?: string;
		usage: number;
		cost: number;
	}[]; // For Stacked Cost Chart
}

export default function formatDataForProduct(
	data: MetricRecord[]
): FormattedData {
	console.log("Original Data:", data);

	// Parse and normalize data
	const parsedData: ParsedMetricRecord[] = data.map((record) => {
		return {
			service_id: record.service_id || "Unknown Service",
			resource_id: record.resource_id || "Unknown Resource",
			resource_type: record.resource_type || "Unknown Type",
			week: record.week || "N/A",
			avg_usage: record.usage_percentage || 0,
			avg_cost: record.service_cost || 0,
			date: record.date || "N/A",
			month: record.month,
		};
	});

	// Aggregate usage data for stacked bar chart
	const aggregatedUsage = parsedData.reduce(
		(acc, record) => {
			const { month, resource_id, avg_usage } = record;

			// Find or create the entry for the given resource_id
			let resourceData = acc.find((item) => item.resource_id === resource_id);
			if (!resourceData) {
				resourceData = {
					resource_id: resource_id || "Unknown Resource",
					usage: 0,
					cost: 0,
				};
				acc.push(resourceData);
			}

			// Add the usage and group by month
			resourceData.usage += avg_usage;

			return acc;
		},
		[] as Array<{ resource_id?: string; usage: number; cost: number }>
	);

	// Aggregate cost data for stacked bar chart
	const aggregatedCost = parsedData.reduce(
		(acc, record) => {
			const { month, resource_id, avg_cost } = record;

			// Find or create the entry for the given resource_id
			let resourceData = acc.find((item) => item.resource_id === resource_id);
			if (!resourceData) {
				resourceData = {
					resource_id: resource_id || "Unknown Resource",
					usage: 0,
					cost: 0,
				};
				acc.push(resourceData);
			}

			// Add the cost and group by month
			resourceData.cost += avg_cost;

			return acc;
		},
		[] as Array<{ resource_id?: string; usage: number; cost: number }>
	);

	// Combine usage and cost data into the required format
	const combinedStackedData = aggregatedUsage.map((usageItem) => {
		const costItem = aggregatedCost.find(
			(costItem) => costItem.resource_id === usageItem.resource_id
		);

		return {
			resource_id: usageItem.resource_id,
			usage: usageItem.usage,
			cost: costItem ? costItem.cost : 0,
		};
	});

	// Group data by service_id for line chart
	const lineUsageCostData = parsedData.reduce(
		(acc, record) => {
			const { service_id } = record;
			if (!acc[service_id]) {
				acc[service_id] = [];
			}
			acc[service_id].push(record);
			return acc;
		},
		{} as Record<string, ParsedMetricRecord[]>
	);

	console.log("Stacked Usage Data:", combinedStackedData);

	return {
		weeklyUsage: {}, // Not needed here
		weeklyCost: {}, // Not needed here
		lineUsageCostData: lineUsageCostData, // Line chart data
		stackedUsageData: combinedStackedData, // Stacked usage data
		stackedCostData: combinedStackedData, // Stacked cost data
	};
}

// Line Chart for Usage and Cost
export function LineUsageCostChart({
	data,
}: {
	data: Record<string, ParsedMetricRecord[]>;
}) {
	console.log(data);
	return (
		<div>
			{Object.entries(data).map(([resourceId, records]) => (
				<div
					key={resourceId}
					style={{ marginBottom: "5rem" }}
				>
					<h3 className="font-bold my-[1rem]">
						Usage & Cost for Service ID: {resourceId}
					</h3>
					<ResponsiveContainer
						width="100%"
						height={700}
					>
						<LineChart data={records}>
							<CartesianGrid strokeDasharray="3 3" />

							<XAxis dataKey="month" />
							<YAxis yAxisId="left" />
							<YAxis
								yAxisId="right"
								orientation="right"
							/>
							<Tooltip />
							<Legend />
							<Line
								yAxisId="left"
								type="monotone"
								dataKey="avg_usage"
								stroke="#8884d8"
								strokeWidth={2}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="avg_cost"
								stroke="#82ca9d"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			))}
		</div>
	);
}

// Stacked Bar Chart for Usage or Cost
export function ProdStackedBarChart({
	data,
	dataKey,
	title,
}: StackedBarChartProps) {
	return (
		<ResponsiveContainer
			width="100%"
			height={400}
		>
			<BarChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" />
				<YAxis />
				<Tooltip />
				<Legend />
				{/* Dynamically render a bar for each resource */}
				{Object.keys(data[0])
					.filter((key) => key !== "month") // Exclude the X-axis key
					.map((serviceId) => (
						<Bar
							key={serviceId}
							dataKey={serviceId}
							stackId="a"
							fill={`#${Math.floor(
								Math.random() * 16777215,
							).toString(16)}`} // Random color
						/>
					))}
			</BarChart>
		</ResponsiveContainer>
	);
}
