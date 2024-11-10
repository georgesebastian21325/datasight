import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

import { formatCustom } from '../../../api/dashboard-functions/services-function';

const SERVICE_COLORS = {
    "SVC0001": "#3D2B1F", // Dark brown
    "SVC0002": "#2F4858", // Dark slate blue
    "SVC0003": "#4A235A", // Dark purple
    "SVC0004": "#1B4F72", // Dark steel blue
    "SVC0005": "#2C3E50"  // Dark teal
};

function CostPerService({ data }) {
    // Combine service_id with resource_type for display in the y-axis
    const formattedData = data.map(item => ({
        ...item,
        displayLabel: `${item.service_id}`
    }));

    // Formatter function for displaying numbers in 000,000,000 format
    const formatNumber = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    return (
        <ChartContainer config={{ cost: { label: "Total Service Cost", color: "hsl(var(--chart-1))" } }} className="h-[500px] w-[650px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    layout="vertical" // Horizontal bar chart
                    margin={{ top: 10, right: 150 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tickFormatter={formatNumber} // Format X-axis values
                    />
                    <YAxis
                        type="category"
                        dataKey="displayLabel" // Display service_id on y-axis
                        width={70} // Increase width for longer labels
                    />
                    <ChartTooltip
                        formatter={(value) => formatNumber(value)} // Format Tooltip values
                    />
                    <Legend verticalAlign="top" />
                    <Bar
                        dataKey="total_service_cost"
                        barSize={20}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SERVICE_COLORS[entry.service_id]} />
                        ))}
                        <LabelList
                            dataKey="total_service_cost"
                            position="insideRight"
                            formatter={(value) => formatNumber(value)} // Format LabelList values
                            style={{ fontSize: 12, fill: "white" }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default CostPerService;
