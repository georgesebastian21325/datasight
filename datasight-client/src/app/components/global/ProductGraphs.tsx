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
	weekly_revenue: number;
}

interface MetricRecord {
	product_id: string;
	service_id: string;
	week: string;
	avg_usage: string; // Original data as string
	avg_cost: string; // Original data as string
	date: string;
	weekly_revenue: string;
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
	yearlyRevenue: Record<
		string,
		{ week: string; revenue: number }[]
	>; // Weekly data by year for Yearly Revenue Line Chart
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
	const parsedData: ParsedMetricRecord[] = data.map(
		(record) => ({
			...record,
			avg_usage: parseFloat(record.avg_usage),
			avg_cost: parseFloat(record.avg_cost),
			weekly_revenue: parseFloat(record.weekly_revenue),
		}),
	);

	const dailyMap: { [key: string]: YearlyFormattedData[] } =
		{};
	parsedData.forEach((entry) => {
		const { service_id, avg_usage, avg_cost } = entry;
		const date = parseISO(entry.date);
		const year = getYear(date).toString();
		const formattedDate = format(date, "yyyy-MM-dd");

		if (!dailyMap[year]) {
			dailyMap[year] = [];
		}

		let dayEntry = dailyMap[year].find(
			(d) => d.year === formattedDate,
		);
		if (!dayEntry) {
			dayEntry = { year: formattedDate };
			dailyMap[year].push(dayEntry);
		}

		if (!dayEntry[service_id]) {
			dayEntry[service_id] = { usage: 0, cost: 0 };
		}

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

	const dailyDataByYear = Object.fromEntries(
		Object.entries(dailyMap).map(([year, dailyData]) => [
			year,
			dailyData,
		]),
	);

	const weeklyUsage = parsedData.reduce((acc, record) => {
		const { service_id } = record;
		if (!acc[service_id]) {
			acc[service_id] = [];
		}
		acc[service_id].push(record);
		return acc;
	}, {} as Record<string, ParsedMetricRecord[]>);

	const weeklyCost = { ...weeklyUsage };

	// Aggregate weekly revenue for each year
	const yearlyRevenue = parsedData.reduce((acc, record) => {
		const year = getYear(parseISO(record.date)).toString();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push({
			week: record.week,
			revenue: record.weekly_revenue,
		});
		return acc;
	}, {} as Record<string, { week: string; revenue: number }[]>);

	return {
		yearlyStackedData: dailyDataByYear,
		weeklyUsage,
		weeklyCost,
		yearlyRevenue, // Now contains weekly data for each year
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

export const YearlyRevenueLineChart: React.FC<{
	data: Record<string, { week: string; revenue: number }[]>;
}> = ({ data }) => {
	return (
		<div>
			<h3 className="font-bold my-[1rem]">
				Weekly Revenue by Year
			</h3>
			{Object.entries(data).map(
				([year, revenueData], index) => (
					<div
						key={year}
						style={{ marginBottom: "2rem" }}
					>
						<h4>Revenue for {year}</h4>
						<ResponsiveContainer
							width="100%"
							height={400}
						>
							<LineChart
								data={revenueData}
								margin={{
									top: 20,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="week" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="revenue"
									stroke={"#08296C"}
									name={`Revenue ${year}`}
									activeDot={{ r: 8 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				),
			)}
		</div>
	);
};
