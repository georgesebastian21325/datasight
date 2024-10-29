import React from "react";
import {
	eachDayOfInterval,
	format,
	getYear,
	parseISO,
} from "date-fns";
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
	service_id: string;
}

interface MetricRecord {
	product_id: string;
	service_id: string;
	week: string;
	avg_usage: string; // Original data as string
	avg_cost: string; // Original data as string
	date: string;
}

interface ParsedMetricRecord {
	product_id: string;
	service_id: string;
	week: string;
	avg_usage: number; // Parsed to number
	avg_cost: number; // Parsed to number
	date: string;
}

interface FormattedData {
	weeklyUsage: Record<string, ParsedMetricRecord[]>; // For Weekly Average Usage Line Chart
	weeklyCost: Record<string, ParsedMetricRecord[]>; // For Weekly Average Cost Line Chart
	yearlyStackedData: {
		[year: string]: YearlyFormattedData[];
	};
}

interface YearlyFormattedData {
	year: string;
	[serviceId: string]:
		| { usage: number; cost: number }
		| string; // Only `service_id` entries have `{ usage: number }`
}

export function formatDataForProduct(
	data: MetricRecord[],
): FormattedData {
	// Step 1: Parse avg_usage and avg_cost to numbers
	const parsedData: ParsedMetricRecord[] = data.map(
		(record) => ({
			...record,
			avg_usage: parseFloat(record.avg_usage),
			avg_cost: parseFloat(record.avg_cost),
		}),
	);

	// Step 2: Prepare data for daily aggregation by year
	const dailyMap: { [key: string]: YearlyFormattedData[] } =
		{};

	parsedData.forEach((entry) => {
		const { service_id, avg_usage, avg_cost } = entry;

		// Parse the date to get the year
		const date = parseISO(entry.date);
		const year = getYear(date).toString();
		const formattedDate = format(date, "yyyy-MM-dd");

		// Initialize the year if it doesn’t exist in dailyMap
		if (!dailyMap[year]) {
			dailyMap[year] = [];
		}

		// Find or create the daily record for this date
		let dayEntry = dailyMap[year].find(
			(d) => d.year === formattedDate,
		);
		if (!dayEntry) {
			dayEntry = { year: formattedDate };
			dailyMap[year].push(dayEntry);
		}

		// Initialize usage for the service_id if not already set
		if (!dayEntry[service_id]) {
			dayEntry[service_id] = { usage: 0, cost: 0 };
		}

		// Aggregate daily usage and cost
		(
			dayEntry[service_id] as {
				usage: number;
				cost: number;
			}
		).usage += avg_usage;
		(
			dayEntry[service_id] as {
				usage: number;
				cost: number;
			}
		).cost += avg_cost;
	});

	// Step 3: Convert dailyMap to arrays for each year
	const dailyDataByYear = Object.fromEntries(
		Object.entries(dailyMap).map(([year, dailyData]) => [
			year,
			dailyData,
		]),
	);

	// Step 3: Prepare weekly usage and cost data grouped by service_id
	const weeklyUsage = parsedData.reduce((acc, record) => {
		const { service_id } = record;
		if (!acc[service_id]) {
			acc[service_id] = [];
		}
		acc[service_id].push(record);
		return acc;
	}, {} as Record<string, ParsedMetricRecord[]>);

	const weeklyCost = { ...weeklyUsage };

	// Step 4: Return formatted data
	return {
		yearlyStackedData: dailyDataByYear,
		weeklyUsage,
		weeklyCost,
	};
}

const COLORS = [
	"#8884d8",
	"#82ca9d",
	"#ffc658",
	"#ff8042",
	"#8dd1e1",
];

export const YearlyStackedUsageCharts: React.FC<{
	data: { [year: string]: YearlyFormattedData[] }; // Updated type to match structure
}> = ({ data }) => {
	// Check if data is empty or undefined to prevent accessing undefined properties
	if (!data || Object.keys(data).length === 0) {
		return <div>No data available</div>;
	}

	return (
		<div>
			{Object.entries(data).map(([year, dailyData]) => (
				<div
					key={year}
					style={{ marginBottom: "2rem" }}
				>
					<h3>Usage for {year}</h3>
					<ResponsiveContainer
						width="100%"
						height={400}
					>
						<BarChart
							data={dailyData}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="year" />
							<YAxis />
							<Tooltip />
							<Legend />
							{dailyData[0] &&
								Object.keys(dailyData[0])
									.filter((key) => key !== "year")
									.map((serviceId, index) => (
										<Bar
											key={serviceId}
											dataKey={`${serviceId}.usage`}
											stackId="a"
											fill={COLORS[index % COLORS.length]}
											name={`${serviceId} Usage`}
										/>
									))}
						</BarChart>
					</ResponsiveContainer>
				</div>
			))}
		</div>
	);
};

export const YearlyStackedCostCharts: React.FC<{
	data: { [year: string]: YearlyFormattedData[] }; // Updated type to match structure
}> = ({ data }) => {
	// Check if data is empty or undefined to prevent accessing undefined properties
	if (!data || Object.keys(data).length === 0) {
		return <div>No data available</div>;
	}

	return (
		<div>
			{Object.entries(data).map(([year, dailyData]) => (
				<div
					key={year}
					style={{ marginBottom: "2rem" }}
				>
					<h3>Usage for {year}</h3>
					<ResponsiveContainer
						width="100%"
						height={400}
					>
						<BarChart
							data={dailyData}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="year" />
							<YAxis />
							<Tooltip />
							<Legend />
							{dailyData[0] &&
								Object.keys(dailyData[0])
									.filter((key) => key !== "year")
									.map((serviceId, index) => (
										<Bar
											key={serviceId}
											dataKey={`${serviceId}.cost`}
											stackId="a"
											fill={COLORS[index % COLORS.length]}
											name={`${serviceId} Cost`}
										/>
									))}
						</BarChart>
					</ResponsiveContainer>
				</div>
			))}
		</div>
	);
};
