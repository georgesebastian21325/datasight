import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/service-components/chart";

const PRODUCT_COLORS = [
    "#4B0082", "#2E8B57", "#B8860B", "#556B2F", "#4682B4"
];


export default function ProductUtilizationRateChart({ data }) {
    // Convert string values to numbers to ensure proper rendering
    const processedData = data.map(entry => ({
        ...entry,
        product_utilization_rate: Number(entry.product_utilization_rate),
    }));

    // Sort processedData by product_id
    processedData.sort((a, b) => a.product_id.localeCompare(b.product_id));


    return (
        <ChartContainer config={{ cost: { label: "Product Revenue Contribution", color: "hsl(var(--chart-1))" } }} className="h-[410px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData} layout="horizontal">
                    <XAxis type="category" dataKey="product_id" style={{ fontSize: '12px', fontWeight: 'bold', fill: 'black' }} />
                    <YAxis type="number" dataKey="product_utilization_rate" domain={[0, 100]} unit="%" style={{ fontSize: '12px', fontWeight: 'bold', fill: 'black' }} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{
                            paddingBottom: 20,
                            transform: 'translateX(-50%)',
                            left: '53%',
                            bottom: -40
                        }}
                        payload={processedData.map((entry, index) => ({
                            id: entry.product_id,
                            type: "square",
                            value: entry.product_id,
                            color: PRODUCT_COLORS[index % PRODUCT_COLORS.length]
                        }))}
                    />

                    <Bar dataKey="product_utilization_rate" fill="#8884d8">
                        {processedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}