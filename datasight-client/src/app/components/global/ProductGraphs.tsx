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
	monthly_usage: number;
	month: string;
	monthly_cost: number;
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
	monthly_usage: number; // Original data as string
	monthly_cost: number; // Original data as string
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
	monthly_usage: number; // Parsed to number
	monthly_cost: number; // Parsed to number
	date: string;
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
	data: MetricRecord[],
): FormattedData {
	console.log("Original Data:", data);

	// Parse usage_percentage and resource_cost as numbers
	const parsedData: ParsedMetricRecord[] = data.map(
		(record) => {
			const usagePercentage =
				record.usage_percentage !== undefined
					? parseFloat(record.usage_percentage.toString())
					: 0;
			const resourceCost =
				record.resource_cost !== undefined
					? parseFloat(record.service_cost!.toString())
					: 0;

			return {
				product_id: record.product_id,
				service_id: record.service_id,
				monthly_usage: usagePercentage, // Parsed usage percentage
				monthly_cost: record.service_cost, // Parsed resource cost
				year: record.year,
				month: record.month, // Extract the month from the date string
			};
		},
	);

	// Group data by `month` and `service_id` for the stacked bar chart
	const aggregatedUsage = parsedData.reduce(
		(acc, record) => {
			const { month, service_id, monthly_usage } = record;

			// Find or create the entry for the given month
			let monthData = acc.find(
				(entry) => entry.month === month,
			);
			if (!monthData) {
				monthData = { month }; // Initialize with only the month key
				acc.push(monthData);
			}

			// Add the usage for the current service_id
			monthData[service_id] =
				(monthData[service_id] || 0) + monthly_usage;

			return acc;
		},
		[] as Array<{ month: string; [key: string]: any }>,
	);

	// Group data by resource_id for line chart
	const lineUsageCostData = parsedData.reduce(
		(acc, record) => {
			const { service_id } = record;
			if (!acc[service_id]) {
				acc[service_id] = [];
			}
			acc[service_id].push(record);
			return acc;
		},
		{} as Record<string, ParsedMetricRecord[]>,
	);

	const aggregatedCost = parsedData.reduce(
		(acc, record) => {
			const { month, service_id, monthly_cost } = record;

			// Find or create the entry for the given month
			let monthData = acc.find(
				(entry) => entry.month === month,
			);
			if (!monthData) {
				monthData = { month }; // Initialize with only the month key
				acc.push(monthData);
			}

			// Add the cost for the current service_id
			monthData[service_id] =
				(monthData[service_id] || 0) + monthly_cost;

			return acc;
		},
		[] as Array<{ month: string; [key: string]: any }>,
	);

	console.log("Stacked Usage Data:", aggregatedUsage);
	console.log("Stacked Cost Data:", aggregatedCost);

	return {
		weeklyUsage: {}, // Not needed here
		weeklyCost: {}, // Not needed here
		lineUsageCostData: lineUsageCostData, // Not needed here
		stackedUsageData: aggregatedUsage, // Stacked usage data structured for Recharts
		stackedCostData: aggregatedCost, // Stacked cost data structured for Recharts
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
								dataKey="monthly_usage"
								stroke="#8884d8"
								strokeWidth={2}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="monthly_cost"
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
			height={700}
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
