import React from 'react';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


function AverageUtilizationChart({data}) {

    return (
        <ChartContainer config={{ cost: { label: "Average Utilization by Resource Type", color: "hsl(var(--chart-1))" } }} className="h-[400px] w-[600px]">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} layout="vertical" margin={{ left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis dataKey="resource_type" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="average_usage_percentage" fill="#8884d8" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}

export default AverageUtilizationChart;