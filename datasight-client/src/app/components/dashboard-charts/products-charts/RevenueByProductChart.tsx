import { PieChart, Pie, Tooltip as ChartTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/service-components/chart";

const PRODUCT_COLORS = [
    "#4B0082", "#2E8B57", "#B8860B", "#556B2F", "#4682B4"
];

const renderCustomLabel = ({ name, value }) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function RevenueByProductChart({ data }) {
    // Sort the data by product_id
    const sortedData = [...data].sort((a, b) => a.product_id.localeCompare(b.product_id));

    return (
        <ChartContainer config={{ cost: { color: "hsl(var(--chart-1))" } }} className="h-[410px]">
            <ResponsiveContainer width="100%" height="200%">
                <PieChart>
                    <Pie
                        data={sortedData} // Use sorted data
                        dataKey="total_resource_cost"
                        nameKey="product_id" // Use product_id as the legend name
                        cx="45%"
                        cy="50%"
                        outerRadius={150}
                        label={renderCustomLabel} // Use custom label function here
                        labelLine={{ stroke: '#8884d8', strokeWidth: 1 }} // Make label lines more visible
                    >
                        {sortedData.map((entry, index) => (
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
                        payload={sortedData.map((entry, index) => ({
                            id: entry.product_id,
                            type: "square",
                            value: entry.product_id,
                            color: PRODUCT_COLORS[index % PRODUCT_COLORS.length]
                        }))} // Custom legend with sorted product_id and color
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default RevenueByProductChart;
