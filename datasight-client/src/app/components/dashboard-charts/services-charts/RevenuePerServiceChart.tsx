import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";

// Define service colors
const SERVICE_COLORS: { [key: string]: string } = {
    SVC0001: "#3D2B1F", // Dark brown
    SVC0002: "#2F4858", // Dark slate blue
    SVC0003: "#4A235A", // Dark purple
    SVC0004: "#1B4F72", // Dark steel blue
    SVC0005: "#2C3E50", // Dark teal
};

// Define the type for a single data item
type RevenueDataItem = {
    service_id: string; // Service ID
    total_service_revenue: string | number; // Revenue as string or number
};

// Define props type
type RevenuePerServiceChartProps = {
    data: RevenueDataItem[]; // Array of RevenueDataItem
};

const RevenuePerServiceChart: React.FC<RevenuePerServiceChartProps> = ({ data }) => {
    // Calculate total revenue to compute percentages
    const totalRevenue = data.reduce(
        (sum, item) => sum + Number(item.total_service_revenue),
        0
    );

    // Prepare data with percentages and labels
    const formattedData = data
        .map((item) => {
            const revenue = Number(item.total_service_revenue);
            const percentage = ((revenue / totalRevenue) * 100).toFixed(2);
            return {
                ...item,
                revenue,
                percentage,
                name: item.service_id,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by service_id in ascending order

    // Formatter function for displaying numbers in 000,000,000 format
    const formatNumber = (value: number): string =>
        `₱ ${value.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })}`;

    return (
        <ChartContainer
            config={{
                cost: { label: "Total Service Revenue", color: "hsl(var(--chart-1))" },
            }}
            className="h-[470px] w-[650px]"
        >
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
                        label={({ revenue, percentage }: { revenue: number; percentage: string }) =>
                            `${formatNumber(revenue)} (${percentage}%)`
                        }
                    >
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={SERVICE_COLORS[entry.service_id] || "#8884d8"}
                            />
                        ))}
                    </Pie>
                    <ChartTooltip
                        formatter={(value: number) => formatNumber(value)}
                        separator=": "
                    />
                    <Legend
                        payload={formattedData.map((item) => ({
                            id: item.name,
                            value: item.name,
                            type: "square",
                            color: SERVICE_COLORS[item.name] || "#8884d8",
                        }))}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default RevenuePerServiceChart;
