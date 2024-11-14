import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell, LabelList
} from 'recharts';
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";

// Define mapping for resource types and their colors based on prefixes
const RESOURCE_MAPPING = {
    "BRS": { type: "Backup and Recovery Systems", color: "#4B0082" },     // Purple
    "CI": { type: "Cloud Infrastructure", color: "#2E8B57" },             // Green
    "INFRA": { type: "Communication Infrastructure", color: "#B8860B" },  // Gold
    "C": { type: "Computer", color: "#556B2F" },                          // Dark Olive Green
    "NEQ": { type: "Network Equipment", color: "#4682B4" },               // Steel Blue
    "HS": { type: "Server", color: "#6A5ACD" },                           // Slate Blue
    "SD": { type: "Storage Device", color: "#2F4F4F" },                   // Dark Slate Gray
    "VI": { type: "Virtual Infrastructure", color: "#8B008B" }            // Dark Magenta
};

// Function to get color and type based on resource_id prefix
function getResourceAttributes(resourceId) {
    const prefixMatch = resourceId.match(/^[A-Z]+/);
    const prefix = prefixMatch ? prefixMatch[0] : "Unknown"; // Handle cases where prefix may not match
    return RESOURCE_MAPPING[prefix] || { type: "Unknown", color: "#000000" }; // Default to "Unknown" and black color if prefix not found
}

function RevenueResourceChart({ data }) {
    // Sort data in descending order based on total_resource_revenue
    const formattedData = data
        .sort((a, b) => b.total_resource_revenue - a.total_resource_revenue)
        .map(item => {
            const { type, color } = getResourceAttributes(item.resource_id);
            return {
                ...item,
                total_resource_revenue: Number(item.total_resource_revenue), // Ensure it's a number
                resource_type: type,
                displayLabel: `${type} (${item.resource_id})`, // Combine inferred type with resource_id for display
                color // Assign color based on resource_type
            };
        });

    return (
        <ChartContainer
            config={{ cost: { label: "Total Resource Revenue", color: "hsl(var(--chart-1))" } }}
            className="h-[200px] w-[600px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    layout="vertical"
                    margin={{ top: 5, right: 70 }} // Increased right margin to accommodate labels
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tickFormatter={(value) =>
                            `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        }
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="displayLabel"
                        width={200}
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
                    />
                    <ChartTooltip
                        formatter={(value) =>
                            `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        }
                    />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="total_resource_revenue" barSize={15}>
                        {/* Custom LabelList */}
                        <LabelList dataKey="total_resource_revenue" content={renderCustomizedLabel} />
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

// Custom label renderer
const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;

    // Threshold to decide when to place the label outside the bar
    const threshold = 40; // Adjust this value as needed

    // Format the value
    const formattedValue = `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (width > threshold) {
        // Label inside the bar
        return (
            <text
                x={x + width - 5}
                y={y + height / 2}
                fill="white"
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={12}
            >
                {formattedValue}
            </text>
        );
    } else {
        // Label outside the bar to the right
        return (
            <text
                x={x + width + 5}
                y={y + height / 2}
                fill="black"
                textAnchor="start"
                dominantBaseline="middle"
                fontSize={12}
            >
                {formattedValue}
            </text>
        );
    }
};

export default RevenueResourceChart;
