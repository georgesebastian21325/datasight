import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

const SERVICE_COLORS = {
    "SVC0001": "#3D2B1F", // Dark brown
    "SVC0002": "#2F4858", // Dark slate blue
    "SVC0003": "#4A235A", // Dark purple
    "SVC0004": "#1B4F72", // Dark steel blue
    "SVC0005": "#2C3E50"  // Dark teal
};

export default function CompareRevenueCostServicesChart({ data }) {
    const formattedData = data.map(item => ({
        ...item,
        displayLabel: `${item.service_id} ${item.total_service_cost}`
    }));

    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[300px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{ top: 15, left: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="total_service_cost"
                        name="Total Service Cost"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <YAxis
                        type="number"
                        dataKey="total_service_revenue"
                        name="Total Service Revenue"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <ChartTooltip
                        formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <Legend verticalAlign="top" />
                    <Scatter
                        name="Services"
                        data={formattedData}
                        shape="circle"
                    >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SERVICE_COLORS[entry.service_id]} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
