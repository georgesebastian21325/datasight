import React from 'react';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine } from 'recharts';

const SERVICE_COLORS = {
    "SVC0001": "#3D2B1F", // Dark brown
    "SVC0002": "#2F4858", // Dark slate blue
    "SVC0003": "#4A235A", // Dark purple
    "SVC0004": "#1B4F72", // Dark steel blue
    "SVC0005": "#2C3E50"  // Dark teal
};

function AverageServiceUtilizationChart({ data }) {
    // Ensure data values are within the 0-100 range

    const formattedData = data.map((item) => ({
        ...item,
        avg_service_utilization: Math.min(Math.max(isNaN(item.average_usage_percentage) ? 0 : item.average_usage_percentage, 0), 100)
    }));


    return (
        <ChartContainer config={{ cost: { label: "Average Utilization by Resource Type", color: "hsl(var(--chart-1))" } }} className="h-[450px] w-[600px] py-12">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                    barCategoryGap="20%" >
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* Reference lines at 50%, 75%, and 100% */}
                    <ReferenceLine y={100} stroke="red" strokeDasharray="3 3" strokeWidth={3} label={{ position: "insideTopRight", fill: "#555" }} />
                    <ReferenceLine y={75} stroke="orange" strokeDasharray="3 3" strokeWidth={3} label={{ position: "insideTopRight", fill: "#555" }} />
                    <ReferenceLine y={50} stroke="green" strokeDasharray="3 3" strokeWidth={3} label={{ position: "insideTopRight", fill: "#555" }} />

                    <YAxis
                        type="number"
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 12, fill: "#333" }}
                    />
                    <XAxis dataKey="service_id" type="category" hide={false} /> {/* Hide X-axis labels */}
                    <Tooltip formatter={(value) => `${value}%`} contentStyle={{ fontSize: 12, color: "#333" }} />

                    <Bar dataKey="avg_service_utilization" barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SERVICE_COLORS[entry.service_id] || "#8884d8"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default AverageServiceUtilizationChart;
