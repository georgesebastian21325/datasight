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
	service_id: string;
	resource_id: string;
	resource_type: string;
	product_id?: string;
	offering_id?: string;
	product_cost: number;
	week: string;
	monthly_usage: number; // Original data as string
	monthly_cost: number; // Original data as string
	date: string;
	usage_percentage?: number;
	resource_cost?: number;
	year: string;
	month: string;
}

interface ParsedMetricRecord {
	service_id: string;
	resource_id: string;
	product_id: string;
	resource_type: string;
	week: string;
	monthly_usage: number; // Parsed to number
	monthly_cost: number; // Parsed to number
	date: string;
	product_cost: number;
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

export default function formatDataForOffering(
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
					? parseFloat(record.product_cost.toString())
					: 0;

			return {
				offering_id: record.offering_id,
				product_id: record.product_id,
				usage_percentage: usagePercentage, // Parsed usage percentage
				product_cost: record.product_cost, // Parsed resource cost
				year: record.year,
				month: record.month, // Extract the month from the date string
			};
		},
	);

	// Group data by `month` and `service_id` for the stacked bar chart
	const aggregatedUsage = parsedData.reduce(
		(acc, record) => {
			const { month, product_id, usage_percentage } =
				record;

			// Find or create the entry for the given month
			let monthData = acc.find(
				(entry) => entry.month === month,
			);
			if (!monthData) {
				monthData = { month }; // Initialize with only the month key
				acc.push(monthData);
			}

			// Add the usage for the current service_id
			monthData[product_id] =
				(monthData[product_id] || 0) + usage_percentage;

			return acc;
		},
		[] as Array<{ month: string; [key: string]: any }>,
	);

	// Group data by resource_id for line chart
	const lineUsageCostData = parsedData.reduce(
		(acc, record) => {
			const { product_id } = record;
			if (!acc[product_id]) {
				acc[product_id] = [];
			}
			acc[product_id].push(record);
			return acc;
		},
		{} as Record<string, ParsedMetricRecord[]>,
	);

	const aggregatedCost = parsedData.reduce(
		(acc, record) => {
			const { month, product_id, product_cost } = record;

			// Find or create the entry for the given month
			let monthData = acc.find(
				(entry) => entry.month === month,
			);
			if (!monthData) {
				monthData = { month }; // Initialize with only the month key
				acc.push(monthData);
			}

			// Add the cost for the current service_id
			monthData[product_id] =
				(monthData[product_id] || 0) + product_cost;

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
export function OffLineUsageCostChart({
	data,
}: {
	data: Record<string, ParsedMetricRecord[]>;
}) {
	console.log(data);
	return (
		<div>
			{Object.entries(data).map(([productId, records]) => (
				<div
					key={productId}
					style={{ marginBottom: "5rem" }}
				>
					<h3 className="font-bold my-[1rem]">
						Usage & Cost for Product ID: {productId}
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
								dataKey="usage_percentage"
								stroke="#8884d8"
								strokeWidth={2}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="product_cost"
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
export function OffStackedBarChart({
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
					.map((productId) => (
						<Bar
							key={productId}
							dataKey={productId}
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
