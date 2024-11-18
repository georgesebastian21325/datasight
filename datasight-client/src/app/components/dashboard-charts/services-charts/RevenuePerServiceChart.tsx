import React from 'react';
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";

const SERVICE_COLORS = {
    "SVC0001": "#3D2B1F", // Dark brown
    "SVC0002": "#2F4858", // Dark slate blue
    "SVC0003": "#4A235A", // Dark purple
    "SVC0004": "#1B4F72", // Dark steel blue
    "SVC0005": "#2C3E50"  // Dark teal
};

function RevenuePerServiceChart({ data }) {
    // Calculate total revenue to compute percentages
    const totalRevenue = data.reduce((sum, item) => sum + Number(item.total_service_revenue), 0);

    // Prepare data with percentages and labels
    const formattedData = data
        .map(item => {
            const revenue = Number(item.total_service_revenue);
            const percentage = ((revenue / totalRevenue) * 100).toFixed(2);
            return {
                ...item,
                revenue,
                percentage,
                name: item.service_id,
            };
        })
        .sort((a, b) => b.revenue - a.revenue); // Sort by revenue in descending order

    // Formatter function for displaying numbers in 000,000,000 format
    const formatNumber = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

    return (
        <ChartContainer config={{ cost: { label: "Total Service Revenue", color: "hsl(var(--chart-1))" } }} className="h-[470px] w-[650px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={formattedData}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        labelLine={true}
                        label={({ revenue, percentage }) => `${formatNumber(revenue)} (${percentage}%)`}
                    >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SERVICE_COLORS[entry.service_id]} />
                        ))}
                    </Pie>
                    <ChartTooltip
                        formatter={(value) => formatNumber(value)}
                        separator=": "
                    />
                    <Legend
                        formatter={(value, entry) => {
                            const legendItem = formattedData.find(item => item.name === entry.value);
                            return `${value}`;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default RevenuePerServiceChart;