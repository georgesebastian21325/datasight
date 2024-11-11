import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

import { formatCustom } from '../../../api/dashboard-functions/services-function';

const SERVICE_COLORS = {
    cost: "#FF5733",      // Bright orange-red for cost
    revenue: "#337AFF"     // Bright blue for revenue
};

export default function CompareRevenueCostServicesChart({ data }) {

    const formattedData = data
        .map(item => ({
            ...item,
            total_service_cost: Number(item.total_service_cost),
            total_service_revenue: Number(item.total_service_revenue),
            displayLabel: `${item.service_id} ${formatCustom(item.total_service_cost)}`
        }))
        .sort((a, b) => a.service_id.localeCompare(b.service_id));

    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[500px] w-[600px] py-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    margin={{ top: 5, left: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="service_id"
                        name="Service ID"
                        tick={{ angle: -45, textAnchor: 'end' }}
                        height={80}
                    />
                    <YAxis
                        name="Amount ($)"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <ChartTooltip
                        formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <Legend verticalAlign="bottom" height={36} />

                    <Bar
                        name="Total Service Cost"
                        dataKey="total_service_cost"
                        fill="red"
                        barSize={30}
                    />
                    <Bar
                        name="Total Service Revenue"
                        dataKey="total_service_revenue"
                        fill="green"
                        barSize={30}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
