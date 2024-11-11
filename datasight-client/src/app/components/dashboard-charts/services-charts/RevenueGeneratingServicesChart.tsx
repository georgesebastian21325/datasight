import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

const SERVICE_COLORS = {
    "SVC0001": "#3D2B1F", // Dark brown
    "SVC0002": "#2F4858", // Dark slate blue
    "SVC0003": "#4A235A", // Dark purple
    "SVC0004": "#1B4F72", // Dark steel blue
    "SVC0005": "#2C3E50"  // Dark teal
};

const RESOURCE_COLORS = {
    "Backup and Recovery System": "#4B0082",
    "Cloud Infrastructure": "#2E8B57",
    "Communication Infrastructure": "#B8860B",
    "Computer": "#556B2F",
    "Network Equipment": "#4682B4",
    "Server": "#6A5ACD",
    "Storage Device": "#2F4F4F",
    "Virtual Infrastructure": "#8B008B"
};

function RevenueGeneratingServicesChart({ data }) {
    // Combine service_id, resource_id, and resource_type for display in the y-axis
    const formattedData = data.map(item => ({
        ...item,
        displayLabel: `${item.service_id} - ${item.resource_type} (${item.resource_id})`
    }));

    return (
        <ChartContainer config={{ cost: { label: "Total Service Revenue", color: "hsl(var(--chart-1))" } }} className="h-[420px] w-[560px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    layout="vertical" // Horizontal bar chart
                    margin={{ top: 30 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <YAxis
                        type="category"
                        dataKey="displayLabel" // Display combined service_id, resource_type, and resource_id on y-axis
                        width={150} // Increase width for longer labels
                    />
                    <ChartTooltip
                        formatter={(value, name, props) => [
                            `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            `${props.payload.resource_type} (${props.payload.resource_id})`
                        ]}
                        labelFormatter={(label) => `Service: ${label.split(" - ")[0]}`}
                    />
                    <Legend verticalAlign="top" />
                    <Bar
                        dataKey="total_service_revenue"
                        barSize={40}
                    >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={RESOURCE_COLORS[entry.resource_type]} />
                        ))}
                        <LabelList
                            dataKey="total_service_revenue"
                            position="right"
                            formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            style={{ fontSize: 12, fill: "#333" }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default RevenueGeneratingServicesChart;
