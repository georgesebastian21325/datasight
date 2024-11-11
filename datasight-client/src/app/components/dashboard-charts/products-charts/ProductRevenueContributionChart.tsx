import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/service-components/chart";

const PRODUCT_COLORS = [
    "#4B0082", "#2E8B57", "#B8860B", "#556B2F", "#4682B4"
];

function ProductRevenueContributionChart({ data }) {
    // Convert string values to numbers to ensure proper rendering
    const processedData = data.map(entry => ({
        ...entry,
        total_revenue: Number(entry.total_revenue),
        revenue_percentage: Number(entry.revenue_percentage),
    }));

    // Sort processedData by product_id
    processedData.sort((a, b) => a.product_id.localeCompare(b.product_id));

    // Custom label function to show both revenue percentage and total revenue
    const renderCustomLabel = ({ x, y, width, value, index }) => {
        const entry = processedData[index];
        return (
            <text
                x={x + width + 5} // Position to the right of the bar
                y={y + 10}        // Adjust vertically
                fill="#000"       // Label color
                fontSize={12}
                textAnchor="start"
            >
                {`${value.toFixed(2)}% ($${entry.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
            </text>
        );
    };

    return (
        <ChartContainer config={{ cost: { label: "Product Revenue Contribution", color: "hsl(var(--chart-1))" } }} className="h-[410px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData} layout="vertical">
                    <XAxis type="number" dataKey="revenue_percentage" domain={[0, 100]} unit="%" />
                    <YAxis type="category" dataKey="product_id" />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend
                        verticalAlign="top"
                        wrapperStyle={{
                            paddingBottom: 20,
                            transform: 'translateX(-50%)',
                            left: '50%'
                        }}
                        payload={processedData.map((entry, index) => ({
                            id: entry.product_id,
                            type: "square",
                            value: entry.product_id,
                            color: PRODUCT_COLORS[index % PRODUCT_COLORS.length]
                        }))}
                    />

                    <Bar dataKey="revenue_percentage" fill="#8884d8">
                        {processedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                        ))}
                        <LabelList dataKey="revenue_percentage" content={renderCustomLabel} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default ProductRevenueContributionChart;
