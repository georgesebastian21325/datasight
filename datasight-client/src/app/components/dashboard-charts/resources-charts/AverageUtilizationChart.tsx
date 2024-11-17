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
    const formattedData = data.map((item) => ({
        ...item,
        resource_id: item.resource_id.trim().toUpperCase(),
        average_monthly_utilization_percentage: Math.min(
            Math.max(
                isNaN(item.average_monthly_utilization_percentage)
                    ? 0
                    : item.average_monthly_utilization_percentage,
                0
            ),
            100
        ),
    }));


    // Get unique resource_ids for the filter dropdown
    const resourceIds = [...new Set(formattedData.map((item) => item.resource_id))];
    const [selectedResourceId, setSelectedResourceId] = useState(resourceIds[0] || '');

    // Filter data based on the selected resource_id
    const filteredData = formattedData.filter(
        (item) => item.resource_id === selectedResourceId
    );

    // Prepare data for the chart
    const dataByMonth = filteredData.map((item) => ({
        month: item.month,
        average_monthly_utilization_percentage: item.average_monthly_utilization_percentage,
    }));

    // Sort the data by month
    dataByMonth.sort((a, b) => {
        const parseMonth = (monthStr) => {
            const monthNumber = parseInt(monthStr.slice(1, 3), 10);
            const yearNumber = parseInt('20' + monthStr.slice(3), 10);
            return new Date(yearNumber, monthNumber - 1).getTime();
        };
        return parseMonth(a.month) - parseMonth(b.month);
    });

    return (
        <ChartContainer
            config={{ cost: { label: "Average Monthly Utilization by Resource ID", color: "hsl(var(--chart-1))" } }}
            className="h-[500px] w-[600px] py-[3rem]"
        >
            {/* Filter Dropdown */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <label htmlFor="resource-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Select Resource ID:
                </label>
                <select
                    id="resource-filter"
                    value={selectedResourceId}
                    onChange={(e) => setSelectedResourceId(e.target.value)}
                >
                    {resourceIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
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
                            bottom: -100,
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
                        name={selectedResourceId}
                        connectNulls={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default AverageUtilizationChart;
