import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

function HighestUtilizedResourcesChart({ data }) {
    // Combine resource_id with resource_type for display in the y-axis
    const formattedData = data.map(item => ({
        ...item,
        displayLabel: `${item.resource_type} (${item.resource_id})`
    }));

    // Function to determine color based on average usage percentage
    const getColor = (percentage) => {
        if (percentage >= 95) return "red";           // Overutilized
        if (percentage >= 75 && percentage < 95) return "yellow"; // Balanced
        return "green";                               // Underutilized
    };

    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[200px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    layout="vertical" // Horizontal bar chart
                    margin={{ top: 5, right: 50 }}
                >
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
                    <Bar dataKey="average_usage_percentage" barSize={20}>
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getColor(entry.average_usage_percentage)} // Set color based on usage percentage
                            />
                        ))}
                        <LabelList
                            dataKey="average_usage_percentage"
                            position="right"
                            formatter={(value) => `${value.toFixed(2)}%`}
                            style={{ fontSize: 12, fill: "#333" }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default HighestUtilizedResourcesChart;
