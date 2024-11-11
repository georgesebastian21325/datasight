import { PieChart, Pie, Tooltip as ChartTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/service-components/chart";

const PRODUCT_COLORS = [
    "#4B0082", "#2E8B57", "#B8860B", "#556B2F", "#4682B4",
    "#6A5ACD", "#2F4F4F", "#8B008B", "#8B4513", "#B22222",
    "#2F2F2F", "#8B0000", "#A0522D", "#483D8B", "#2B2B2B"
];

const renderCustomLabel = ({ name, value }) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function RevenueByProductChart({ data }) {
    return (
        <ChartContainer config={{ cost: { color: "hsl(var(--chart-1))" } }} className="h-[410px]">
            <ResponsiveContainer width="100%" height="200%" >
                <PieChart >
                    <Pie
                        data={data}
                        dataKey="total_resource_cost"
                        nameKey="product_id" // Use product_id as the legend name
                        cx="45%"
                        cy="50%"
                        outerRadius={150}
                        label={renderCustomLabel} // Use custom label function here
                        labelLine={{ stroke: '#8884d8', strokeWidth: 1 }} // Make label lines more visible
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                        ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                            bottom: -20, // Adjusts the distance from the bottom of the container
                            left: '45%', // Centers horizontally
                            transform: 'translateX(-50%)', // Centers the legend accurately
                        }}
                        payload={data.map((entry, index) => ({
                            id: entry.product_id,
                            type: "square",
                            value: entry.product_id,
                            color: PRODUCT_COLORS[index % PRODUCT_COLORS.length]
                        }))} // Custom legend with product_id and color
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default RevenueByProductChart;
