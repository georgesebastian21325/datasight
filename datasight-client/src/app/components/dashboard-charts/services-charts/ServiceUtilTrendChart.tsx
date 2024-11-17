import React, { useState } from 'react';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

const SERVICE_COLORS = {
    "SVC0001": "#3D2B1F", // Dark brown
    "SVC0002": "#2F4858", // Dark slate blue
    "SVC0003": "#4A235A", // Dark purple
    "SVC0004": "#1B4F72", // Dark steel blue
    "SVC0005": "#2C3E50"  // Dark teal
};

function ServiceUtilTrendLineChart({ data }) {
    // Extract unique service IDs for dropdown options
    const serviceIds = [...new Set(data.map(item => item.service_id))];
    const [selectedService, setSelectedService] = useState(serviceIds[0]);

    // Filter data based on the selected service
    const filteredData = data
        .filter(item => item.service_id === selectedService)
        .map(item => ({
            ...item,
            date: new Date(item.date).toISOString().split("T")[0], // Format date as "YYYY-MM-DD"
            avg_daily_service_utilization: Math.min(Math.max(isNaN(item.avg_daily_service_utilization) ? 0 : item.avg_daily_service_utilization, 0), 100)
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure dates are sorted in ascending order

    // Calculate the average utilization
    const averageUtilization =
        filteredData.reduce((sum, item) => sum + item.avg_daily_service_utilization, 0) /
        (filteredData.length || 1); // Avoid division by zero

    return (
        <div className="chart-container">
            {/* Dropdown to select the service */}
            <div className="mb-3">
                <label htmlFor="serviceSelect" className="mr-2 font-bold">Select Service:</label>
                <select
                    id="serviceSelect"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="border rounded p-2"
                >
                    {serviceIds.map(serviceId => (
                        <option key={serviceId} value={serviceId}>
                            {serviceId}
                        </option>
                    ))}
                </select>
            </div>

            {/* Line chart for the selected service */}
            <ChartContainer config={{ cost: { label: "Service Utilization Trend", color: "hsl(var(--chart-1))" } }} className="h-[500px] w-[1300px] py-12">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 20, left: 50 }}>
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
                        <Line
                            type="monotone"
                            dataKey="avg_daily_service_utilization"
                            name={selectedService}
                            stroke={SERVICE_COLORS[selectedService]}
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            connectNulls // Connect data points even if some dates are missing
                        />
                        {/* Add ReferenceLine for average utilization */}
                        <ReferenceLine
                            y={averageUtilization}
                            stroke="red"
                            strokeDasharray="3 3"
                            label={{
                                position: 'left',
                                value: `Average: ${averageUtilization.toFixed(2)}%`,
                                fill: 'red',
                                fontSize: 12,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}

export default ServiceUtilTrendLineChart;
