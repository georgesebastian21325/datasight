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
	ScatterChart,
	Scatter,
	BarChart,
	Bar,
} from "recharts";

// Props Interfaces
interface ParsedMetricRecord {
	week: string;
	avg_usage: number;
	avg_cost: number;
	resource_id: string;
}

interface WeeklyUsageChartProps {
	data: Record<string, ParsedMetricRecord[]>;
}

interface WeeklyCostChartProps {
	data: Record<string, ParsedMetricRecord[]>;
}

interface UsageVsCostScatterPlotProps {
	data: ParsedMetricRecord[];
}

interface ResourceTypeCostBarChartProps {
	data: { resource_type: string; avg_cost: number }[];
}

interface DualAxisLineChartProps {
	data: Record<string, ParsedMetricRecord[]>;
}

interface MetricRecord {
	service_id: string;
	resource_id: string;
	resource_type: string;
	week: string;
	avg_usage: string; // Original data as string
	avg_cost: string; // Original data as string
	date: string;
}

interface ParsedMetricRecord {
	service_id: string;
	resource_id: string;
	resource_type: string;
	week: string;
	avg_usage: number; // Parsed to number
	avg_cost: number; // Parsed to number
	date: string;
}

interface FormattedData {
	weeklyUsage: Record<string, ParsedMetricRecord[]>; // For Weekly Average Usage Line Chart
	weeklyCost: Record<string, ParsedMetricRecord[]>; // For Weekly Average Cost Line Chart
	usageVsCost: ParsedMetricRecord[]; // For Usage vs. Cost Scatter Plot
	resourceTypeCost: {
		resource_type: string;
		avg_cost: number;
	}[]; // For Resource Type Cost Comparison Bar Chart
	dualAxisData: Record<string, ParsedMetricRecord[]>; // For Weekly Cost and Usage Dual Axis Line Chart
}

export default function formatDataForService(
	data: MetricRecord[],
): FormattedData {
	// Convert avg_usage and avg_cost to numbers and store as ParsedMetricRecord[]
	const parsedData: ParsedMetricRecord[] = data.map(
		(record) => ({
			...record,
			avg_usage: parseFloat(record.avg_usage),
			avg_cost: parseFloat(record.avg_cost),
		}),
	);

	// 1. Group data by `resource_id` for weekly usage and cost charts
	const weeklyUsage = parsedData.reduce((acc, record) => {
		const { resource_id } = record;
		if (!acc[resource_id]) {
			acc[resource_id] = [];
		}
		acc[resource_id].push(record);
		return acc;
	}, {} as Record<string, ParsedMetricRecord[]>);

	const weeklyCost = { ...weeklyUsage }; // Reuse the same grouping for cost, since it's grouped by week already

	// 2. Usage vs. Cost Scatter Plot - use parsedData directly
	const usageVsCost = parsedData;

	// 3. Aggregate avg_cost by `resource_type` for Resource Type Cost Comparison Bar Chart
	const resourceTypeCost = Object.values(
		parsedData.reduce((acc, record) => {
			const { resource_type, avg_cost } = record;
			if (!acc[resource_type]) {
				acc[resource_type] = {
					resource_type,
					total_cost: 0,
					count: 0,
				};
			}
			acc[resource_type].total_cost += avg_cost;
			acc[resource_type].count += 1;
			return acc;
		}, {} as Record<string, { resource_type: string; total_cost: number; count: number }>),
	).map((item) => ({
		resource_type: item.resource_type,
		avg_cost: item.total_cost / item.count, // Calculate average cost for each resource type
	}));

	// 4. Dual Axis Line Chart data by `resource_id`
	const dualAxisData = weeklyUsage; // Can reuse `weeklyUsage` structure since it has both avg_usage and avg_cost

	return {
		weeklyUsage,
		weeklyCost,
		usageVsCost,
		resourceTypeCost,
		dualAxisData,
	};
}

export function WeeklyUsageChart({
	data,
}: WeeklyUsageChartProps) {
	return (
		<div>
			{Object.entries(data).map(([resourceId, records]) => (
				<div
					key={resourceId}
					style={{ marginBottom: "2rem" }}
				>
					<h3 className="font-bold my-[1rem]">
						Weekly Average Usage for Resource ID:{" "}
						{resourceId}
					</h3>
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
								type="monotone"
								dataKey="avg_usage"
								stroke="#8884d8"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			))}
		</div>
	);
}

export function WeeklyCostChart({
	data,
}: WeeklyCostChartProps) {
	return (
		<div>
			{Object.entries(data).map(([resourceId, records]) => (
				<div
					key={resourceId}
					style={{ marginBottom: "2rem" }}
				>
					<h3 className="font-bold my-[1rem]">
						Weekly Average Cost for Resource ID:{" "}
						{resourceId}
					</h3>
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

export function UsageVsCostScatterPlot({
	data,
}: UsageVsCostScatterPlotProps) {
	return (
		<div>
			<h3 className="font-bold">
				Usage vs Cost Scatter Plot
			</h3>
			<ResponsiveContainer
				width="100%"
				height={400}
			>
				<ScatterChart>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="avg_usage"
						name="Usage"
						unit="%"
					/>
					<YAxis
						dataKey="avg_cost"
						name="Cost"
						unit="$"
					/>
					<Tooltip cursor={{ strokeDasharray: "3 3" }} />
					<Scatter
						name="Usage vs Cost"
						data={data}
						fill="#8884d8"
					/>
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	);
}

export function ResourceTypeCostBarChart({
	data,
}: ResourceTypeCostBarChartProps) {
	return (
		<div>
			<h3 className="font-bold my-[1rem]">
				Average Daily Cost by Resource Type
			</h3>
			<ResponsiveContainer
				width="100%"
				height={400}
			>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="resource_type" />
					<YAxis />
					<Tooltip />
					<Bar
						dataKey="avg_cost"
						fill="#82ca9d"
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

export function DualAxisLineChart({
	data,
}: DualAxisLineChartProps) {
	return (
		<div>
			{Object.entries(data).map(([resourceId, records]) => (
				<div
					key={resourceId}
					style={{ marginBottom: "2rem" }}
				>
					<h3 className="font-bold my-[1rem]">
						Weekly Cost and Usage for Resource ID:{" "}
						{resourceId}
					</h3>
					<ResponsiveContainer
						width="100%"
						height={400}
					>
						<LineChart data={records}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="week" />
							<YAxis
								yAxisId="left"
								label={{
									value: "Usage",
									angle: -90,
									position: "insideLeft",
								}}
							/>
							<YAxis
								yAxisId="right"
								orientation="right"
								label={{
									value: "Cost",
									angle: -90,
									position: "insideRight",
								}}
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
