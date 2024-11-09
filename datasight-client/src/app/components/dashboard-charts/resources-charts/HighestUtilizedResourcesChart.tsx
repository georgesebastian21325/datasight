import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

function HighestUtilizedResourcesChart({ data }) {
    // Combine resource_id with resource_type for display in the y-axis
    const formattedData = data.map(item => ({
        ...item,
        displayLabel: `${item.resource_type} (${item.resource_id})`
    }));

    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[200px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    layout="vertical" // Horizontal bar chart
                    margin={{ top: 5 }}
                >
                    <defs>
                        {/* Define a gradient for high usage (Green to Yellow to Red) */}
                        <linearGradient id="highUsageGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="green" />
                            <stop offset="40%" stopColor="green" />
                            <stop offset="50%" stopColor="yellow" />
                            <stop offset="60%" stopColor="yellow" />
                            <stop offset="80%" stopColor="red" />
                            <stop offset="100%" stopColor="red" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tickFormatter={(value) => `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`}
                    />
                    <YAxis
                        type="category"
                        dataKey="displayLabel" // Display resource_type and resource_id on y-axis
                        width={200} // Increase width for longer labels
                    />
                    <ChartTooltip
                        formatter={(value) => [
                            `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ]}
                    />
                    <Legend verticalAlign="top" />
                    <Bar
                        dataKey="average_usage_percentage"
                        barSize={15}
                    >
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#${entry.average_usage_percentage > 50 ? 'highUsageGradient' : 'lowUsageGradient'})`}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default HighestUtilizedResourcesChart;
