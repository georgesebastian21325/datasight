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

interface GroupedData {
	[metric_type: string]: MetricRecord[];
}

interface MetricRecord {
	resource_id: string;
	metric_type: string;
	week: string;
	average_metric_value: number;
}

interface ResourceGraphsProps {
	groupedData: GroupedData;
	selectedNodeId: string;
}

export function ResourceGraphs({
	groupedData,
	selectedNodeId,
}: ResourceGraphsProps) {
	console.log(groupedData);
	return (
		<div className="flex flex-col justify-center text-center mx-auto">
			<h1 className="font-bold my-[1rem] text-[1.5rem]">
				{selectedNodeId}
			</h1>
			<div className="grid grid-cols-2 gap-2">
				{groupedData ? (
					Object.entries(groupedData).map(
						([metricType, records]) => (
							<div
								key={metricType}
								style={{ marginBottom: "2rem" }}
							>
								<h2 className="font-bold my-[1rem]">
									{metricType}
								</h2>
								<ResponsiveContainer
									width="100%"
									height={400}
								>
									<LineChart data={records}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="week" />
										<YAxis
											domain={
												metricType.includes("_ms")
													? [0, 150]
													: [0, 100]
											}
										/>
										<Tooltip />
										<Legend />
										<Line
											type="natural"
											dataKey="average_metric_value"
											stroke="#8884d8"
											strokeWidth={1}
											activeDot={{ r: 6 }}
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
	);
}
