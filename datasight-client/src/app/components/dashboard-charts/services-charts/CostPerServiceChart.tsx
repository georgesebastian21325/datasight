import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

const SERVICE_COLORS = {
    "SVC0001": "#4B0082",
    "SVC0002": "#2E8B57",
    "SVC0003": "#B8860B",
    "SVC0004": "#556B2F",
    "SVC0005": "#4682B4"
};

function CostPerService({ data }) {
    // Combine resource_id with resource_type for display in the y-axis
    const formattedData = data.map(item => ({
        ...item,
        displayLabel: `${item.service_id}`
    }));

    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[350px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    layout="vertical" // Horizontal bar chart
                    margin={{ top: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <YAxis
                        type="category"
                        dataKey="displayLabel" // Display resource_type and resource_id on y-axis
                        width={70} // Increase width for longer labels
                    />
                    <ChartTooltip
                        formatter={(value, name, props) => [
                            `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ]}
                    />
                    <Legend verticalAlign="top" />
                    <Bar
                        dataKey="total_service_cost"
                        barSize={20}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SERVICE_COLORS[entry.service_id]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default CostPerService;
