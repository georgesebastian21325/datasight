import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/service-components/chart";

const PRODUCT_COLORS = [
    "#4B0082", "#2E8B57", "#B8860B", "#556B2F", "#4682B4"
];

function CostByProductChart({ data }) {
    // Sort the data by product_id
    const sortedData = [...data].sort((a, b) => a.product_id.localeCompare(b.product_id));

    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[200px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData} margin={{ top: 20, right: 20, left: 60, bottom: -10 }}  >
                    <XAxis dataKey="product_id" style={{ fontSize: '12px', fontWeight: 'bold', fill: 'black' }} />
                    <YAxis tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} style={{ fontSize: '12px', fontWeight: 'bold', fill: 'black' }}  />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                            bottom: -20, // Adjusts the distance from the bottom of the container
                            left: '50%', // Centers horizontally
                            transform: 'translateX(-50%)', // Centers the legend accurately
                        }}
                        payload={sortedData.map((entry, index) => ({
                            id: entry.product_id,
                            type: "square",
                            value: entry.product_id,
                            color: PRODUCT_COLORS[index % PRODUCT_COLORS.length]
                        }))} // Custom legend with sorted product_id and color
                    />
                    <Bar dataKey="total_resource_cost" name="Total Resource Cost">
                        {sortedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default CostByProductChart;
