import React, { useState } from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
} from "recharts";

// Define the data type
type DataItem = {
    resource_id: string;
    period: string; // Format: "YYYY-MM-DD"
    predicted_cost_average: number;
    predicted_revenue_average: number;
};

// Define props for the chart
interface AverageUtilizationChartProps {
    data: DataItem[];
}

const AverageUtilizationScatterPlot: React.FC<AverageUtilizationChartProps> = ({
    data,
}) => {
    // Format the period as "Month Year"
    const formattedData = data.map((item) => {
        const date = new Date(item.period);
        const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" });
        return { ...item, monthYear };
    });

    // Extract unique resource IDs and periods
    const resourceIds = Array.from(new Set(formattedData.map((item) => item.resource_id)));
    const periods = Array.from(new Set(formattedData.map((item) => item.monthYear))).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Set up state for filters
    const [selectedResourceId, setSelectedResourceId] = useState<string>(
        resourceIds[0] || ""
    );
    const [startPeriod, setStartPeriod] = useState<string>(periods[0] || "");
    const [endPeriod, setEndPeriod] = useState<string>(periods[periods.length - 1] || "");

    // Filter data based on the selected resource ID and date range
    const filteredData = formattedData.filter((item) => {
        const isWithinDateRange =
            periods.indexOf(item.monthYear) >= periods.indexOf(startPeriod) &&
            periods.indexOf(item.monthYear) <= periods.indexOf(endPeriod);
        return item.resource_id === selectedResourceId && isWithinDateRange;
    });

    return (
        <div className="h-[500px] w-[1300px] py-[3rem]">
            {/* Filters */}
            <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                {/* Resource ID Filter */}
                <label
                    htmlFor="resource-filter"
                    style={{ marginRight: "0.5rem", fontWeight: "bold" }}
                >
                    Select Resource ID:
                </label>
                <select
                    id="resource-filter"
                    value={selectedResourceId}
                    onChange={(e) => setSelectedResourceId(e.target.value)}
                    style={{ marginRight: "1rem" }}
                    className="border rounded p-2"
                >
                    {resourceIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>

                {/* Start Date Filter */}
                <label
                    htmlFor="start-date-filter"
                    style={{ marginRight: "0.5rem", fontWeight: "bold" }}
                >
                    Start Date:
                </label>
                <select
                    id="start-date-filter"
                    value={startPeriod}
                    onChange={(e) => setStartPeriod(e.target.value)}
                    style={{ marginRight: "1rem" }}
                    className="border rounded p-2"
                >
                    {periods.map((period) => (
                        <option key={period} value={period}>
                            {period}
                        </option>
                    ))}
                </select>

                {/* End Date Filter */}
                <label
                    htmlFor="end-date-filter"
                    style={{ marginRight: "0.5rem", fontWeight: "bold" }}
                >
                    End Date:
                </label>
                <select
                    id="end-date-filter"
                    value={endPeriod}
                    onChange={(e) => setEndPeriod(e.target.value)}
                    className="border rounded p-2"
                >
                    {periods.map((period) => (
                        <option key={period} value={period}>
                            {period}
                        </option>
                    ))}
                </select>
            </div>

            {/* Scatter Plot */}
            <ResponsiveContainer width="100%" height="80%">
                <ScatterChart margin={{ top: 20, right: 10, bottom: 20, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="category"
                        dataKey="monthYear"
                        label={{ value: "Period", position: "insideBottom", offset: -10 }}
                        style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            fill: "#333",
                        }}
                        angle={-20}
                        textAnchor="end"
                    />
                    <YAxis
                        type="number"
                        tickFormatter={(value) => `₱${value}`}
                        label={{
                            value: "Amount (₱)",
                            angle: -90,
                            position: "insideLeft",
                            offset: -10,
                        }}
                        style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            fill: "#333",
                        }}
                    />
                    <Tooltip
                        formatter={(value, name) => [`₱${value}`]}
                        labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Legend verticalAlign="top" height={36} />

                    {/* Scatter points for predicted cost */}
                    <Scatter
                        name="Predicted Cost"
                        data={filteredData}
                        fill="#8884d8"
                        dataKey="predicted_cost_average"
                    />
                    {/* Scatter points for predicted revenue */}
                    <Scatter
                        name="Predicted Revenue"
                        data={filteredData}
                        fill="#82ca9d"
                        dataKey="predicted_revenue_average"
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AverageUtilizationScatterPlot;
