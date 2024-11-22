import React, { useState } from "react";
import {
    LineChart,
    Line,
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
    resource_type: string;
    month: string;
    avg_monthly_resource_utilization: number;
};

// Define props for the chart
interface AverageUtilizationChartProps {
    data: DataItem[];
}

const AverageUtilizationChart: React.FC<AverageUtilizationChartProps> = ({
    data,
}) => {
    // Helper to map month numbers to names
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Format the data and ensure utilization percentage is valid
    const formattedData = data.map((item) => {
        const month = item.month.trim().toUpperCase(); // e.g., "M0121"
        const monthIndex = parseInt(month.slice(1, 3), 10) - 1; // Convert "01" to 0-based index
        const yearSuffix = month.slice(3, 5); // Extract "21" as the year suffix
        const year = 2000 + parseInt(yearSuffix, 10); // Convert "21" to 2021

        return {
            ...item,
            resource_id: item.resource_id.trim().toUpperCase(),
            resource_type: item.resource_type.trim(),
            monthName: `${monthNames[monthIndex]} ${year}`, // Format as "January 2021"
            year,
            avg_monthly_resource_utilization: Math.min(
                Math.max(item.avg_monthly_resource_utilization || 0, 0),
                100
            ),
        };
    });

    // Get unique resource IDs and months for filtering
    const resourceIds = Array.from(
        new Set(formattedData.map((item) => item.resource_id))
    );
    const months = Array.from(
        new Set(formattedData.map((item) => item.monthName))
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // State for filters
    const [selectedResourceId, setSelectedResourceId] = useState<string>(
        resourceIds[0] || ""
    );
    const [startMonth, setStartMonth] = useState<string>(months[0] || "");
    const [endMonth, setEndMonth] = useState<string>(
        months[months.length - 1] || ""
    );

    // Filter data based on the selected resource ID and month range
    const filteredData = formattedData.filter((item) => {
        const isWithinMonthRange =
            months.indexOf(item.monthName) >= months.indexOf(startMonth) &&
            months.indexOf(item.monthName) <= months.indexOf(endMonth);
        return item.resource_id === selectedResourceId && isWithinMonthRange;
    });

    // Calculate the average utilization
    const averageUtilization =
        filteredData.reduce(
            (sum, item) => sum + item.avg_monthly_resource_utilization,
            0
        ) / (filteredData.length || 1); // Avoid division by zero

    // Determine the color of the average line
    const averageLineColor =
        averageUtilization <= 50
            ? "green"
            : averageUtilization <= 75
                ? "yellow"
                : "red";

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

                {/* Start Month Filter */}
                <label
                    htmlFor="start-month-filter"
                    style={{ marginRight: "0.5rem", fontWeight: "bold" }}
                >
                    Start Month:
                </label>
                <select
                    id="start-month-filter"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    style={{ marginRight: "1rem" }}
                    className="border rounded p-2"
                >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>

                {/* End Month Filter */}
                <label
                    htmlFor="end-month-filter"
                    style={{ marginRight: "0.5rem", fontWeight: "bold" }}
                >
                    End Month:
                </label>
                <select
                    id="end-month-filter"
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className="border rounded p-2"
                >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <LineChart data={filteredData} margin={{ top: 5, right: 70, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* Reference lines at 50%, 75%, 100%, and Average */}
                    <ReferenceLine
                        y={100}
                        stroke="red"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                        label={{ position: "insideTopRight", fill: "#555", value: "100%" }}
                    />
                    <ReferenceLine
                        y={75}
                        stroke="orange"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                        label={{ position: "insideTopRight", fill: "#555", value: "75%" }}
                    />
                    <ReferenceLine
                        y={50}
                        stroke="green"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                        label={{ position: "insideTopRight", fill: "#555", value: "50%" }}
                    />
                    <ReferenceLine
                        y={averageUtilization}
                        stroke={averageLineColor}
                        strokeWidth={2}
                        label={{
                            position: "right",
                            fill: "black",
                            value: `${averageUtilization.toFixed(2)}%`,
                        }}
                    />

                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 12, fill: "#333" }}
                        style={{
                            fontSize: "9px",
                            fontWeight: "bold",
                            fill: "black",
                        }}
                    />
                    <XAxis
                        dataKey="monthName"
                        style={{
                            fontSize: "9px",
                            fontWeight: "bold",
                            fill: "black",
                        }}
                        angle={-20}
                        textAnchor="end"
                        dy={10}
                    />
                    <Tooltip
                        formatter={(value) => `${value}%`}
                        contentStyle={{ fontSize: 12, color: "#333" }}
                        labelFormatter={(label) => `Month: ${label}`}
                    />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                            bottom: -20,
                            left: "45%",
                            transform: "translateX(-41%)",
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="avg_monthly_resource_utilization"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name={selectedResourceId}
                        connectNulls={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AverageUtilizationChart;
