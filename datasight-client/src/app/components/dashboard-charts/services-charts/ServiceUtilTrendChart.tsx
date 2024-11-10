import React from 'react';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SERVICE_COLORS = {
    "SVC0001": "#3D2B1F", // Dark brown
    "SVC0002": "#2F4858", // Dark slate blue
    "SVC0003": "#4A235A", // Dark purple
    "SVC0004": "#1B4F72", // Dark steel blue
    "SVC0005": "#2C3E50"  // Dark teal
};

function ServiceUtilTrendAreaChart({ data }) {
    // Convert date to a format without timestamp, ensure utilization is within 0-100 range, and sort by date
    const formattedData = data
        .map((item) => ({
            ...item,
            date: new Date(item.date).toISOString().split("T")[0], // Format date as "YYYY-MM-DD"
            avg_daily_service_utilization: Math.min(Math.max(isNaN(item.avg_daily_service_utilization) ? 0 : item.avg_daily_service_utilization, 0), 100)
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure dates are sorted in ascending order

    return (
        <ChartContainer config={{ cost: { label: "Service Utilization Trend", color: "hsl(var(--chart-1))" } }} className="h-[500px] w-[1000px] py-12">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart margin={{ top: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        type="category"
                        tickFormatter={(date) => date}
                        tick={{ fontSize: 12, fill: "#333" }}
                    />
                    <YAxis
                        type="number"
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 12, fill: "#333" }}
                    />
                    <Tooltip
                        labelFormatter={(label) => label}
                        formatter={(value) => `${value}%`}
                        contentStyle={{ fontSize: 12, color: "#333" }}
                    />
                    <Legend verticalAlign="bottom" />

                    {/* Area for each service */}
                    {Object.keys(SERVICE_COLORS).map((service_id) => (
                        <Area
                            key={service_id}
                            type="monotone"
                            dataKey="avg_daily_service_utilization"
                            data={formattedData.filter((item) => item.service_id === service_id)}
                            name={service_id}
                            stroke={SERVICE_COLORS[service_id]}
                            fill={SERVICE_COLORS[service_id]}
                            fillOpacity={0.2} // Make area semi-transparent
                            connectNulls // Connect data points even if some dates are missing
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default ServiceUtilTrendAreaChart;
