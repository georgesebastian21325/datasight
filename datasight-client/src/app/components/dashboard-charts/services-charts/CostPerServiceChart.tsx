import React from 'react';
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";

import { formatCustom } from '../../../api/dashboardFunctions/services-function';

const SERVICE_COLORS = {
    "SVC0001": "#3D2B1F", // Dark brown
    "SVC0002": "#2F4858", // Dark slate blue
    "SVC0003": "#4A235A", // Dark purple
    "SVC0004": "#1B4F72", // Dark steel blue
    "SVC0005": "#2C3E50"  // Dark teal
};

function CostPerService({ data }) {
    // Calculate total cost to compute percentages
    const totalCost = data.reduce((sum, item) => sum + Number(item.total_service_cost), 0);

    // Prepare data with percentages and labels
    const formattedData = data.map(item => {
        const cost = Number(item.total_service_cost);
        const percentage = ((cost / totalCost) * 100).toFixed(2);
        return {
            ...item,
            cost,
            percentage,
            name: item.service_id,
        };
    });

    // Formatter function for displaying numbers in 000,000,000 format
    const formatNumber = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

    return (
        <ChartContainer config={{ cost: { label: "Total Service Cost", color: "hsl(var(--chart-1))" } }} className="h-[470px] w-[650px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={formattedData}
                        dataKey="cost"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        labelLine={true}
                        label={({ cost, percentage }) => `${formatNumber(cost)} (${percentage}%)`}
                    >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SERVICE_COLORS[entry.service_id]} />
                        ))}
                    </Pie>
                    <ChartTooltip
                        formatter={(value) => formatNumber(value)}
                        separator=": "
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default CostPerService;
