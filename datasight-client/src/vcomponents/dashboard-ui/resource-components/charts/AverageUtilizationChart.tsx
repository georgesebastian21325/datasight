import React from 'react';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine } from 'recharts';

const RESOURCE_COLORS = {
    "Backup and Recovery System": "#4B0082",
    "Cloud Infrastructure": "#2E8B57",
    "Communication Infrastructure": "#B8860B",
    "Computer": "#556B2F",
    "Network Equipment": "#4682B4",
    "Server": "#6A5ACD",
    "Storage Devices": "#2F4F4F",
    "Virtual Infrastructure": "#8B008B"
};

function AverageUtilizationChart({ data }) {
    // Ensure data values are within the 0-100 range
    const formattedData = data.map((item) => ({
        ...item,
        average_usage_percentage: Math.min(Math.max(isNaN(item.average_usage_percentage) ? 0 : item.average_usage_percentage, 0), 100)
    }));

    return (
        <ChartContainer config={{ cost: { label: "Average Utilization by Resource Type", color: "hsl(var(--chart-1))" } }} className="h-[450px] w-[600px] py-12">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData} layout="horizontal" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* Reference lines at 0% and 100% */}
                    <ReferenceLine y={100} stroke="red" strokeDasharray="3 3" label={{ value: "100%", position: "insideTopRight", fill: "#555" }} />

                    <YAxis
                        type="number"
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 12, fill: "#333" }} // Increased font size for readability
                    />
                    <XAxis dataKey="resource_type" type="category" hide={true} /> {/* Hide X-axis labels */}
                    <Tooltip formatter={(value) => `${value}%`} contentStyle={{ fontSize: 12, color: "#333" }} />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                            bottom: -50,
                            left: '45%',
                            transform: 'translateX(-41%)',
                        }}
                        payload={Object.keys(RESOURCE_COLORS).map((key) => ({
                            value: key,
                            type: "square",
                            color: RESOURCE_COLORS[key]
                        }))}
                    />

                    <Bar dataKey="average_usage_percentage" barSize={20}>
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={RESOURCE_COLORS[entry.resource_type] || "#8884d8"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default AverageUtilizationChart;
