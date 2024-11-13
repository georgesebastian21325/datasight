import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell, LabelList
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

function HighestUtilizedResourcesChart({ data }) {
    // Combine resource_id with resource_type for display in the y-axis
    const formattedData = data.map(item => ({
        ...item,
        displayLabel: `${item.resource_type} (${item.resource_id})`
    }));

    // Function to interpolate color based on average usage percentage
    const getInterpolatedColor = (percentage) => {
        let color;
        const green = { r: 0, g: 255, b: 0 };
        const yellow = { r: 255, g: 255, b: 0 };
        const red = { r: 255, g: 0, b: 0 };

        if (percentage <= 75) {
            // Interpolate between green and yellow
            const ratio = percentage / 75; // 0 to 1
            color = {
                r: Math.round(green.r + ratio * (yellow.r - green.r)),
                g: Math.round(green.g + ratio * (yellow.g - green.g)),
                b: Math.round(green.b + ratio * (yellow.b - green.b)),
            };
        } else if (percentage > 75 && percentage < 95) {
            // Interpolate between yellow and red
            const ratio = (percentage - 75) / (95 - 75); // 0 to 1
            color = {
                r: Math.round(yellow.r + ratio * (red.r - yellow.r)),
                g: Math.round(yellow.g + ratio * (red.g - yellow.g)),
                b: Math.round(yellow.b + ratio * (red.b - yellow.b)),
            };
        } else {
            // percentage >= 95%
            color = red;
        }
        // Return the color as a rgb string
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    };

    return (
        <ChartContainer
            config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }}
            className="h-[200px] w-[600px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    layout="vertical" // Horizontal bar chart
                    margin={{ top: 5, right: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tickFormatter={(value) =>
                            `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`
                        }
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }} 
                    />
                    <YAxis
                        type="category"
                        dataKey="displayLabel" // Display resource_type and resource_id on y-axis
                        width={200} // Increase width for longer labels
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }} 
                    />
                    <ChartTooltip
                        formatter={(value) => [
                            `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ]}
                    />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="average_usage_percentage" barSize={20}>
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getInterpolatedColor(entry.average_usage_percentage)} // Set color based on usage percentage
                            />
                        ))}
                        <LabelList
                            dataKey="average_usage_percentage"
                            position="right"
                            formatter={(value) => `${value.toFixed(2)}%`}
                            style={{ fontSize: 12, fill: "#333" }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default HighestUtilizedResourcesChart;
