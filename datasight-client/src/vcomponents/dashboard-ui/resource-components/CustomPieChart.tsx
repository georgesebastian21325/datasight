import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip as ChartTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";


const COLORS = [
    "#4B0082", "#2E8B57", "#B8860B", "#556B2F", "#4682B4",
    "#6A5ACD", "#2F4F4F", "#8B008B", "#8B4513", "#B22222",
    "#2F2F2F", "#8B0000", "#A0522D", "#483D8B", "#2B2B2B"
];



function CustomPieChart({ data }) {
    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total_resource_cost"
                        nameKey="resource_type"
                        cx="60%"
                        cy="60%"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{
                        position: 'absolute', // Allows manual positioning
                        bottom: -100, // Adjusts the distance from the bottom of the container
                        left: '60%', // Centers horizontally
                        transform: 'translateX(-50%)', // Centers the legend accurately
                        marginTop: '20px' // Adds space between the chart and legend
                    }} />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default CustomPieChart;