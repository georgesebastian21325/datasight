import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

const RESOURCE_COLORS = {
    "Backup and Recovery Systems": "#4B0082",
    "Cloud Infrastructure": "#2E8B57",
    "Communication Infrastructure": "#B8860B",
    "Computer": "#556B2F",
    "Network Equipment": "#4682B4",
    "Server": "#6A5ACD",
    "Storage Devices": "#2F4F4F",
    "Virtual Infrastructure": "#8B008B"
};

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
                        formatter={(value) => `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`}
                    />
                    <Legend verticalAlign="top" />
                    <Bar
                        dataKey="average_usage_percentage"
                        barSize={15}
                    >
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={RESOURCE_COLORS[entry.resource_type] || "#8884d8"} // Use a default color if undefined
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default HighestUtilizedResourcesChart;
