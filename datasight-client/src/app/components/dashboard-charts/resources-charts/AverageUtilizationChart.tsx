import React, { useState } from 'react';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine
} from 'recharts';

function AverageUtilizationChart({ data }) {
    // Format the data and ensure utilization percentage is valid
    const formattedData = data.map((item) => ({
        ...item,
        resource_type: item.resource_type.trim(),
        average_monthly_utilization_percentage: Math.min(
            Math.max(
                isNaN(item.average_monthly_utilization_percentage)
                    ? parseFloat(item.average_daily_resource_utilization || 0)
                    : item.average_monthly_utilization_percentage,
                0
            ),
            100
        ),
    }));

    // Get unique resource types for the filter dropdown
    const resourceTypes = [...new Set(formattedData.map((item) => item.resource_type))];
    const [selectedResourceType, setSelectedResourceType] = useState(resourceTypes[0] || '');

    // Filter data based on the selected resource type
    const filteredData = formattedData.filter(
        (item) => item.resource_type === selectedResourceType
    );

    // Prepare data for the chart
    const dataByMonth = filteredData.map((item) => ({
        month: item.day, // Replace 'day' with 'month' if available
        average_monthly_utilization_percentage: item.average_monthly_utilization_percentage,
    }));

    // Sort the data by month
    dataByMonth.sort((a, b) => {
        const parseMonth = (monthStr) => {
            const monthMap = {
                JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
                JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
            };
            const [month, year] = [monthStr.slice(0, 3).toUpperCase(), monthStr.slice(3)];
            return new Date(parseInt(year, 10), monthMap[month]).getTime();
        };
        return parseMonth(a.month) - parseMonth(b.month);
    });

    return (
        <ChartContainer
            config={{ cost: { label: "Average Monthly Utilization by Resource Type", color: "hsl(var(--chart-1))" } }}
            className="h-[500px] w-[1300px] py-[3rem]"
        >
            {/* Filter Dropdown */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <label htmlFor="resource-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Select Resource Type:
                </label>
                <select
                    id="resource-filter"
                    value={selectedResourceType}
                    onChange={(e) => setSelectedResourceType(e.target.value)}
                >
                    {resourceTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <LineChart data={dataByMonth} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* Reference lines at 50%, 75%, and 100% */}
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

                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 12, fill: "#333" }}
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
                    />
                    <XAxis
                        dataKey="month"
                        hide={false}
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
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
                            left: '45%',
                            transform: 'translateX(-41%)'
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="average_monthly_utilization_percentage"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name={selectedResourceType}
                        connectNulls={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default AverageUtilizationChart;
